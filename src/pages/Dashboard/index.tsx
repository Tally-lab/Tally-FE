import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderGit2, Building2, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../../components/layout/Header";
import RepositoryCard from "../../components/dashboard/RepositoryCard";
import OrganizationCard from "../../components/dashboard/OrganizationCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import type { Repository, Organization } from "../../types";
import { repositoryAPI, organizationAPI } from "../../services/api";
import { getUser } from "../../utils/auth";

const INITIAL_DISPLAY_COUNT = 6;

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllPersonal, setShowAllPersonal] = useState(false);

  const user = getUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [repos, orgs] = await Promise.all([
        repositoryAPI.getUserRepositories(),
        organizationAPI.getUserOrganizations(),
      ]);

      setRepositories(repos);
      setOrganizations(orgs);
    } catch (err: any) {
      console.error("데이터 조회 실패:", err);

      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 429) {
        setError(
          "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (err.code === "ECONNABORTED") {
        setError("요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.");
      } else {
        setError("데이터를 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositoryClick = (repo: Repository) => {
    const ownerLogin =
      typeof repo.owner === "object" ? repo.owner.login : repo.owner;
    navigate(`/analysis/${ownerLogin}/${repo.name}`);
  };

  const handleOrganizationClick = (orgLogin: string) => {
    navigate(`/organization/${orgLogin}`);
  };

  // 개인 레포지토리만 필터링 (조직 레포는 조직 페이지에서 확인)
  const personalRepos = repositories.filter((repo) => {
    const ownerLogin =
      typeof repo.owner === "object" ? repo.owner.login : repo.owner;
    const ownerType = typeof repo.owner === "object" ? repo.owner.type : "User";

    // 조직 소유 레포 제외
    if (ownerType === "Organization") return false;

    // Fork이고 원본이 조직인 경우도 제외
    if (repo.fork && repo.parent && typeof repo.parent.owner === "object") {
      if (repo.parent.owner.type === "Organization") return false;
    }

    return true;
  });

  // 표시할 개인 레포지토리
  const displayedPersonalRepos = showAllPersonal
    ? personalRepos
    : personalRepos.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
          <p className="text-gray-600">
            조직을 선택하면 팀원 기여도를 확인할 수 있습니다
          </p>
        </div>

        {isLoading && (
          <LoadingSpinner size="lg" text="데이터를 불러오는 중..." />
        )}

        {error && !isLoading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !error && repositories.length === 0 && organizations.length === 0 && (
          <EmptyState
            icon={FolderGit2}
            title="데이터가 없습니다"
            description="GitHub 계정에 레포지토리가 없거나 권한이 없습니다."
            action={{
              label: "새로고침",
              onClick: fetchData,
            }}
          />
        )}

        {!isLoading && !error && (repositories.length > 0 || organizations.length > 0) && (
          <>
            {/* 내 조직 섹션 */}
            {organizations.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  내 조직
                  <span className="text-sm font-normal text-gray-500">
                    ({organizations.length})
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  조직을 클릭하면 팀원들의 기여도를 확인할 수 있습니다
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizations.map((org) => (
                    <OrganizationCard
                      key={org.login}
                      organization={org}
                      onClick={() => handleOrganizationClick(org.login)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 개인 프로젝트 섹션 */}
            {personalRepos.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FolderGit2 className="w-6 h-6" />
                  개인 프로젝트
                  <span className="text-sm font-normal text-gray-500">
                    ({personalRepos.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPersonalRepos.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      onClick={() => handleRepositoryClick(repo)}
                    />
                  ))}
                </div>

                {/* 더보기/접기 버튼 */}
                {personalRepos.length > INITIAL_DISPLAY_COUNT && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllPersonal(!showAllPersonal)}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {showAllPersonal ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          접기
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          더보기 ({personalRepos.length - INITIAL_DISPLAY_COUNT}개 더)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
