import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { reportAPI } from '../../services/api';
import type { ReportData } from '../../types';
import DoraChart from '../../components/chat/DoraChart';
import BusFactorChart from '../../components/chat/BusFactorChart';
import BurnoutChart from '../../components/chat/BurnoutChart';
import CommitQualityChart from '../../components/chat/CommitQualityChart';
import ReviewBottleneckChart from '../../components/chat/ReviewBottleneckChart';
import RoleDistributionChart from '../../components/chat/RoleDistributionChart';
import TechStackChart from '../../components/chat/TechStackChart';

function ReportSection({ title, interpretation, children }: {
  title: string;
  interpretation?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="report-section mb-8 break-inside-avoid">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">
        {title}
      </h2>
      <div className="mb-4">{children}</div>
      {interpretation && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
          <p className="text-sm font-semibold text-indigo-700 mb-1">AI 해석</p>
          <p className="text-sm text-gray-700 leading-relaxed">{interpretation}</p>
        </div>
      )}
    </section>
  );
}

function ActionItemCard({ icon, title, description }: {
  icon: string; title: string; description: string;
}) {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <p className="text-gray-600 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function Report() {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    reportAPI.getData(reportId)
      .then(setReport)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">리포트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">리포트를 불러올 수 없습니다</p>
          <p className="text-gray-500 mt-2">{error || '리포트가 만료되었거나 존재하지 않습니다.'}</p>
        </div>
      </div>
    );
  }

  const { aiDiagnosis } = report;
  const generatedDate = report.generatedAt
    ? new Date(report.generatedAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  const hasData = (d: unknown): boolean => {
    if (!d || typeof d !== 'object') return false;
    const obj = d as Record<string, unknown>;
    if ('error' in obj || 'raw' in obj) return false;
    if (obj.null === true || Object.keys(obj).length === 0) return false;
    return true;
  };

  const safeChart = (d: unknown, requiredKeys: string[]): boolean => {
    if (!hasData(d)) return false;
    const obj = d as Record<string, unknown>;
    return requiredKeys.every(key => {
      const val = obj[key];
      return val !== null && val !== undefined;
    });
  };

  return (
    <div className="bg-white min-h-screen" data-report-ready="true">
      {/* 다운로드 바 (인쇄 시 숨김) */}
      <div className="print:hidden sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-[210mm] mx-auto px-8 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {report.owner}/{report.repo} 리포트
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={16} />
            PDF로 저장
          </button>
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto px-8 py-10 print:px-0 print:py-0">

        {/* 커버 */}
        <header className="text-center mb-12 pb-8 border-b-2 border-gray-200 break-after-avoid">
          <div className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Engineering Intelligence Report
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {report.owner}/{report.repo}
          </h1>
          <p className="text-gray-500">
            {generatedDate} 생성 · 최근 {report.analysisPeriodDays}일 분석
          </p>
        </header>

        {/* Executive Summary */}
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">
            Executive Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryCard
              label="DORA 등급"
              value={extractDoraOverall(report.dora)}
              color="indigo"
            />
            <SummaryCard
              label="Bus Factor"
              value={extractBusFactor(report.busFactor)}
              color="amber"
            />
            <SummaryCard
              label="커밋 품질"
              value={extractCommitGrade(report.commitQuality)}
              color="emerald"
            />
            <SummaryCard
              label="리뷰 대기 PR"
              value={extractPendingPRs(report.reviewBottleneck)}
              color="rose"
            />
          </div>
        </section>

        {/* DORA 메트릭 */}
        {safeChart(report.dora, ['metrics', 'overall']) && (
          <ReportSection title="개발 속도와 안정성 (DORA)" interpretation={aiDiagnosis?.doraInterpretation}>
            <DoraChart data={report.dora as never} />
          </ReportSection>
        )}

        {/* Bus Factor */}
        {safeChart(report.busFactor, ['busFactor', 'contributors']) && (
          <ReportSection title="코드 의존도 (Bus Factor)" interpretation={aiDiagnosis?.busFactorInterpretation}>
            <BusFactorChart data={report.busFactor as never} />
          </ReportSection>
        )}

        {/* 번아웃 위험도 */}
        {safeChart(report.burnout, ['contributors']) && (
          <ReportSection title="야근/과로 위험도" interpretation={aiDiagnosis?.burnoutInterpretation}>
            <BurnoutChart data={report.burnout as never} />
          </ReportSection>
        )}

        {/* 커밋 품질 */}
        {safeChart(report.commitQuality, ['grade', 'types']) && (
          <ReportSection title="작업 기록 품질" interpretation={aiDiagnosis?.commitQualityInterpretation}>
            <CommitQualityChart data={report.commitQuality as never} />
          </ReportSection>
        )}

        {/* 리뷰 병목 */}
        {safeChart(report.reviewBottleneck, ['reviewers']) && (
          <ReportSection title="코드 리뷰 대기 현황" interpretation={aiDiagnosis?.reviewBottleneckInterpretation}>
            <ReviewBottleneckChart data={report.reviewBottleneck as never} />
          </ReportSection>
        )}

        {/* 기술 스택 */}
        {safeChart(report.techStack, ['categories']) && (
          <ReportSection title="기술 스택">
            <TechStackChart data={report.techStack as never} />
          </ReportSection>
        )}

        {/* 역할 분포 */}
        {safeChart(report.roleDistribution, ['roles']) && (
          <ReportSection title="작업 유형 분포">
            <RoleDistributionChart data={report.roleDistribution as never} />
          </ReportSection>
        )}

        {/* AI 종합 진단 */}
        {aiDiagnosis && (
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-indigo-500">
              AI 종합 진단 & 액션 아이템
            </h2>

            {aiDiagnosis.immediateActions?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-red-600 mb-2">즉시 조치 필요</h3>
                <div className="space-y-2">
                  {aiDiagnosis.immediateActions.map((item, i) => (
                    <ActionItemCard key={i} {...item} />
                  ))}
                </div>
              </div>
            )}

            {aiDiagnosis.improvements?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-amber-600 mb-2">개선 권고</h3>
                <div className="space-y-2">
                  {aiDiagnosis.improvements.map((item, i) => (
                    <ActionItemCard key={i} {...item} />
                  ))}
                </div>
              </div>
            )}

            {aiDiagnosis.strengths?.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-emerald-600 mb-2">잘하고 있는 점</h3>
                <div className="space-y-2">
                  {aiDiagnosis.strengths.map((item, i) => (
                    <ActionItemCard key={i} {...item} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 푸터 */}
        <footer className="text-center text-gray-400 text-xs pt-8 border-t border-gray-200 mt-12">
          Generated by DevPulse · Tally-lab · {generatedDate}
        </footer>
      </div>
    </div>
  );
}

// --- Summary Card ---

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color] || colorMap.indigo}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// --- 데이터 추출 헬퍼 ---

function extractDoraOverall(dora: unknown): string {
  if (!dora || typeof dora !== 'object') return 'N/A';
  const d = dora as Record<string, unknown>;
  if (d.overall) return String(d.overall);
  if (d.raw) return 'N/A';
  return 'N/A';
}

function extractBusFactor(bf: unknown): string {
  if (!bf || typeof bf !== 'object') return 'N/A';
  const d = bf as Record<string, unknown>;
  if (d.busFactor !== undefined) return `${d.busFactor}명`;
  if (d.raw) return 'N/A';
  return 'N/A';
}

function extractCommitGrade(cq: unknown): string {
  if (!cq || typeof cq !== 'object') return 'N/A';
  const d = cq as Record<string, unknown>;
  if (d.grade) return String(d.grade);
  if (d.raw) return 'N/A';
  return 'N/A';
}

function extractPendingPRs(rb: unknown): string {
  if (!rb || typeof rb !== 'object') return 'N/A';
  const d = rb as Record<string, unknown>;
  if (d.pendingPRs !== undefined) return `${d.pendingPRs}개`;
  if (d.raw) return 'N/A';
  return 'N/A';
}
