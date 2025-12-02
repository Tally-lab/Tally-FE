import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  GitCommit,
  GitBranch,
  Percent,
  Sparkles,
  FileText,
} from "lucide-react";
import Header from "../../components/layout/Header";
import StatsCard from "../../components/analysis/StatsCard";
import RoleDistributionChart from "../../components/analysis/RoleDistributionChart";
import ContributionList from "../../components/analysis/ContributionList";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import type { ContributionStats, PullRequest, Issue } from "../../types";
import { analysisAPI, aiAPI } from "../../services/api";

export default function Analysis() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();

  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (owner && repo) {
      fetchAnalysisData();
    }
  }, [owner, repo]);

  const fetchAnalysisData = async () => {
    if (!owner || !repo) return;

    try {
      setIsLoading(true);
      setError(null);

      // localStorage에서 사용자 정보 가져오기
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username || user?.login || "";

      if (!username) {
        setError("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 실제 백엔드 API 호출
      const analysisResult = await analysisAPI.analyzeContribution(
        owner,
        repo,
        username
      );

      setStats(analysisResult);
      setPullRequests(analysisResult.pullRequests || []);
      setIssues(analysisResult.issues || []);
    } catch (err: any) {
      console.error("분석 실패:", err);

      // 에러 메시지 세분화
      if (err.response?.status === 404) {
        setError("레포지토리를 찾을 수 없습니다.");
      } else if (err.response?.status === 403) {
        setError("레포지토리에 접근할 권한이 없습니다.");
      } else if (err.response?.status === 429) {
        setError(
          "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (err.code === "ECONNABORTED") {
        setError("분석 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.");
      } else {
        setError("기여도 분석에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAISummary = async () => {
    if (!owner || !repo || isLoadingAI) return;

    try {
      setIsLoadingAI(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username || user?.login || "";

      if (!username) return;

      const result = await aiAPI.analyzeWithAI(owner, repo, username);
      setAiSummary(result.aiSummary);
    } catch (err: any) {
      console.error("AI 요약 실패:", err);
      setAiSummary("AI 요약을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleDownloadMarkdown = async () => {
    if (!owner || !repo || isDownloading) return;

    try {
      setIsDownloading(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username || user?.login || "";

      if (!username) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 백엔드에서 Markdown 리포트 받아오기
      const response = await analysisAPI.downloadMarkdownReport(
        owner,
        repo,
        username
      );

      // Blob 생성 및 다운로드
      const blob = new Blob([response.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${repo}-contribution-report.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Markdown 다운로드 실패:", err);
      alert("리포트 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHTML = async () => {
    if (!owner || !repo || isDownloading) return;

    try {
      setIsDownloading(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username || user?.login || "";

      if (!username) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 백엔드에서 HTML 리포트 받아오기
      const response = await analysisAPI.downloadHtmlReport(
        owner,
        repo,
        username
      );

      // Blob 생성 및 다운로드
      const blob = new Blob([response.content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${repo}-contribution-report.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("HTML 다운로드 실패:", err);
      alert("리포트 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!owner || !repo || isDownloading) return;

    try {
      setIsDownloading(true);

      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const username = user?.username || user?.login || "";

      if (!username) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 백엔드에서 PDF 리포트 받아오기 (Base64 인코딩)
      const response = await analysisAPI.downloadPdfReport(
        owner,
        repo,
        username
      );

      // Base64 디코딩 및 Blob 생성
      const binaryString = atob(response.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });

      // 다운로드
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.filename || `${repo}-contribution-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF 다운로드 실패:", err);
      alert("PDF 리포트 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" text="기여도를 분석하는 중..." />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            대시보드로 돌아가기
          </button>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 mb-4">
              {error || "분석 결과를 불러올 수 없습니다."}
            </p>
            <button onClick={fetchAnalysisData} className="btn-primary">
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          대시보드로 돌아가기
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
              {repo} 분석 결과
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{owner}의 기여도 분석</p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleDownloadMarkdown}
              disabled={isDownloading}
              className="btn-secondary flex items-center gap-1 sm:gap-2 text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">{isDownloading ? "..." : "MD"}</span>
              <span className="xs:hidden">MD</span>
            </button>
            <button
              onClick={handleDownloadHTML}
              disabled={isDownloading}
              className="btn-secondary flex items-center gap-1 sm:gap-2 text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "..." : "HTML"}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="btn-primary flex items-center gap-1 sm:gap-2 text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <FileText className="w-4 h-4" />
              <span>{isDownloading ? "..." : "PDF"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={GitCommit}
            label="총 커밋 수"
            value={stats.totalCommits}
            subValue="전체 프로젝트"
            color="primary"
          />
          <StatsCard
            icon={GitBranch}
            label="내 커밋 수"
            value={stats.userCommits}
            subValue={`${stats.commitPercentage.toFixed(1)}% 기여`}
            color="success"
          />
          <StatsCard
            icon={Percent}
            label="기여도"
            value={`${stats.commitPercentage.toFixed(1)}%`}
            subValue={`+${stats.additions || 0} / -${
              stats.deletions || 0
            } 라인`}
            color="secondary"
          />
        </div>

        {/* AI 요약 섹션 */}
        <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg w-fit">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                AI 기여 분석
              </h3>
              {aiSummary ? (
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {aiSummary}
                </div>
              ) : isLoadingAI ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  AI가 분석 중입니다...
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 mb-3">
                    AI가 당신의 기여를 분석하고 이력서용 요약을 생성합니다.
                  </p>
                  <button
                    onClick={fetchAISummary}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI 요약 생성
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {stats.roleDistribution && (
          <div className="mb-8">
            <RoleDistributionChart
              data={{
                backend: stats.roleDistribution.backend?.commitCount || 0,
                frontend: stats.roleDistribution.frontend?.commitCount || 0,
                infrastructure:
                  stats.roleDistribution.infrastructure?.commitCount || 0,
                test: stats.roleDistribution.test?.commitCount || 0,
                documentation:
                  stats.roleDistribution.documentation?.commitCount || 0,
                configuration:
                  stats.roleDistribution.configuration?.commitCount || 0,
                other: stats.roleDistribution.other?.commitCount || 0,
              }}
            />
          </div>
        )}

        <ContributionList
          pullRequests={pullRequests}
          issues={issues}
          commitMessages={stats.commitMessages}
        />
      </div>
    </div>
  );
}
