import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, GitCommit, AlertCircle, Users } from "lucide-react";
import Header from "../../components/layout/Header";
import RepositoryCard from "../../components/dashboard/RepositoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OrganizationStats from "../../components/organization/OrganizationStats";
import type {
  OrganizationStats as OrgStatsType,
  Repository,
} from "../../types";
import { organizationAPI } from "../../services/api";
import { getUser } from "../../utils/auth";

export default function OrganizationDetail() {
  const { orgName } = useParams<{ orgName: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<OrgStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();

  useEffect(() => {
    if (orgName) {
      fetchOrganizationStats();
    }
  }, [orgName]);

  const fetchOrganizationStats = async () => {
    if (!orgName) return;
    try {
      setIsLoading(true);
      setError(null);

      // user가 없을 경우 localStorage에서 직접 가져오기
      const currentUser = getUser();
      const username = currentUser?.username;
      console.log("Fetching org stats with username:", username);

      const data = await organizationAPI.getOrganizationStats(
        orgName,
        username
      );
      setStats(data);
    } catch (err: any) {
      console.error("조직 통계 조회 실패:", err);
      setError("조직 통계를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositoryClick = (repoName: string) => {
    navigate(`/analysis/${orgName}/${repoName}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" text="조직 통계를 분석하는 중..." />
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
              {error || "조직 통계를 불러올 수 없습니다."}
            </p>
            <button onClick={fetchOrganizationStats} className="btn-primary">
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

        {/* 조직 헤더 */}
        <div className="mb-8 flex items-center gap-6">
          {stats.avatarUrl ? (
            <img
              src={stats.avatarUrl}
              alt={stats.organizationName}
              className="w-24 h-24 rounded-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
          )}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {stats.organizationName}
            </h2>
            <p className="text-gray-600">
              {stats.description || "조직 통계 및 기여도"}
            </p>
          </div>
        </div>

        {/* 전체 통계 */}
        <OrganizationStats stats={stats} />

        {/* 팀원 기여도 */}
        {stats.teamMembers && stats.teamMembers.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-6 h-6" />
              팀원 기여도
            </h3>
            <p className="text-gray-500 mb-6">
              총 {stats.teamMembers.length}명의 기여자
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.teamMembers.map((member) => (
                <div
                  key={member.login}
                  className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.login}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 font-medium">
                        {member.login.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {member.login}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.commits} commits
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {member.contributionPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 레포지토리 목록 */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            레포지토리 목록
          </h3>
          <p className="text-gray-500 mb-6">
            기여한 레포지토리 {stats.totalRepositories ?? 0}개 / 전체 {stats.repositories?.length ?? 0}개
          </p>
          {!stats.repositories || stats.repositories.length === 0 ? (
            <div className="p-8 bg-white rounded-lg border border-gray-200 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                이 조직에서 기여한 레포지토리가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {stats.repositories.map((repo) => (
                <div
                  key={repo.fullName}
                  onClick={() => handleRepositoryClick(repo.name)}
                  className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {repo.name}
                      </h4>
                      <p className="text-sm text-gray-500">{repo.fullName}</p>
                    </div>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      GitHub에서 보기 →
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <GitCommit className="w-4 h-4" />
                        <span>내 커밋</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {repo.userCommits ?? 0}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <GitCommit className="w-4 h-4" />
                        <span>전체 커밋</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {repo.totalCommits ?? 0}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">기여도</div>
                      <p className="text-2xl font-bold text-blue-600">
                        {(repo.contributionPercentage ?? 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
