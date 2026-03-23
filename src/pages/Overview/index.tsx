import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, MessageSquare, Users, GitBranch, GitPullRequest,
  ExternalLink, ChevronDown, ArrowLeft, Shield, Activity,
  Sun, Moon, Loader2, FileText,
} from 'lucide-react';
import TechStackChart from '../../components/chat/TechStackChart';
import { overviewAPI, userAPI, reportAPI } from '../../services/api';
import { getAccessToken } from '../../utils/auth';
import type { ProjectOverview } from '../../types';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
}

const BF_COLORS: Record<string, string> = {
  '양호': '#10b981',
  '보통': '#3b82f6',
  '주의': '#f59e0b',
  '위험': '#ef4444',
};

const LANG_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

export default function Overview({ darkMode, onToggleDark }: Props) {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<string[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [repoDropdownOpen, setRepoDropdownOpen] = useState(false);
  const [data, setData] = useState<ProjectOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');

  const token = getAccessToken();

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    userAPI.getOrganizations(token).then(setOrgs).catch(() => {});
  }, [token, navigate]);

  const fetchOrgRepos = useCallback(async (org: string) => {
    if (!token) return;
    try {
      const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
      });
      const data = await res.json();
      setRepos(data.map((r: { name: string }) => r.name));
    } catch {
      setRepos([]);
    }
  }, [token]);

  useEffect(() => {
    if (selectedOrg) {
      fetchOrgRepos(selectedOrg);
      setSelectedRepo('');
      setData(null);
    }
  }, [selectedOrg, fetchOrgRepos]);

  useEffect(() => {
    if (!token || !selectedOrg || !selectedRepo) return;
    setLoading(true);
    setError('');
    overviewAPI.get(token, selectedOrg, selectedRepo)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, selectedOrg, selectedRepo]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    return `${days}일 전`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/chat')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">프로젝트 개요</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Org selector */}
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300 max-w-[120px] truncate">{selectedOrg || '조직 선택'}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${orgDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {orgDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOrgDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 max-h-64 overflow-y-auto">
                    {orgs.map((org) => (
                      <button
                        key={org}
                        onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedOrg === org ? 'text-brand-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {org}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Repo selector */}
            {selectedOrg && (
              <div className="relative">
                <button
                  onClick={() => setRepoDropdownOpen(!repoDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                >
                  <GitBranch size={14} className="text-brand-500" />
                  <span className="text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{selectedRepo || '레포 선택'}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${repoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {repoDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setRepoDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 max-h-64 overflow-y-auto">
                      {repos.map((r) => (
                        <button
                          key={r}
                          onClick={() => { setSelectedRepo(r); setRepoDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedRepo === r ? 'text-brand-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Empty state */}
        {!selectedOrg && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 shadow-xl shadow-brand-500/20">
              <Bot size={32} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">프로젝트 개요</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">조직과 레포지토리를 선택하면 프로젝트 현황을 한눈에 볼 수 있습니다.</p>
          </div>
        )}

        {selectedOrg && !selectedRepo && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <GitBranch size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400">레포지토리를 선택해주세요.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={32} className="text-brand-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500">프로젝트 분석 중...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Repo Info */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{data.repo.fullName}</h1>
                {data.repo.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{data.repo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span>⭐ {data.repo.stars}</span>
                <span>🍴 {data.repo.forks}</span>
              </div>
            </div>

            {/* Health + Activity Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">코드 의존도</span>
                </div>
                <p className="text-lg font-bold" style={{ color: BF_COLORS[data.health.busFactor.status] ?? '#6b7280' }}>
                  {data.health.busFactor.score}명
                </p>
                <p className="text-[11px]" style={{ color: BF_COLORS[data.health.busFactor.status] ?? '#6b7280' }}>
                  {data.health.busFactor.status}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <GitPullRequest size={14} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">리뷰 대기</span>
                </div>
                <p className={`text-lg font-bold ${data.health.review.openPRs > 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {data.health.review.openPRs}건
                </p>
                <p className="text-[11px] text-gray-400">열린 PR</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">최근 7일</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.recentActivity.commits7d}</p>
                <p className="text-[11px] text-gray-400">커밋</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <GitPullRequest size={14} className="text-gray-400" />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">최근 7일</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.recentActivity.prsMerged7d}</p>
                <p className="text-[11px] text-gray-400">머지된 PR</p>
              </div>
            </div>

            {/* Pending PRs */}
            {data.health.review.pendingPRs.length > 0 && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">리뷰 대기 중인 PR</h3>
                <div className="space-y-2">
                  {data.health.review.pendingPRs.map((pr) => (
                    <div key={pr.number} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-medium text-brand-500">#{pr.number}</span>
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{pr.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-gray-400">@{pr.author}</span>
                        <span className="text-[10px] text-gray-400">{timeAgo(pr.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors + Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contributors */}
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">기여자</h3>
                  <span className="text-[10px] text-gray-400">({data.contributors.length}명)</span>
                </div>
                <div className="space-y-2">
                  {data.contributors.slice(0, 8).map((c, i) => (
                    <div key={c.login} className="flex items-center gap-2">
                      <img src={c.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 w-24 truncate">{c.login}</span>
                      <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.percentage}%`, backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 w-10 text-right">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">언어 분포</h3>
                {/* Bar */}
                <div className="flex h-4 rounded-full overflow-hidden mb-3">
                  {Object.entries(data.languages).map(([lang, pct], i) => (
                    <div
                      key={lang}
                      style={{ width: `${pct}%`, backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }}
                      title={`${lang}: ${pct}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {Object.entries(data.languages).map(([lang, pct], i) => (
                    <div key={lang} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{lang}</span>
                      <span className="text-[10px] text-gray-400">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            {data.techStack.totalCount > 0 && (
              <TechStackChart data={{ repo: data.repo.fullName, ...data.techStack }} />
            )}

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/chat')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-medium text-sm hover:from-brand-600 hover:to-brand-800 transition-all shadow-lg shadow-brand-500/20"
              >
                <MessageSquare size={16} />
                채팅으로 자세히 분석하기
              </button>
              <button
                onClick={async () => {
                  if (!token || !selectedOrg || !selectedRepo) return;
                  setReportLoading(true);
                  try {
                    const report = await reportAPI.generate(token, selectedOrg, selectedRepo);
                    navigate(`/report/${report.reportId}`);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : '리포트 생성 실패');
                  } finally {
                    setReportLoading(false);
                  }
                }}
                disabled={reportLoading}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-brand-500 text-brand-600 dark:text-brand-400 font-medium text-sm hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-all disabled:opacity-50"
              >
                {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                {reportLoading ? '생성 중...' : '종합 리포트'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
