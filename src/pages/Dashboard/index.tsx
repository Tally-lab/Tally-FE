import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderGit2, Building2 } from "lucide-react";
import Header from "../../components/layout/Header";
import RepositoryCard from "../../components/dashboard/RepositoryCard";
import OrganizationCard from "../../components/dashboard/OrganizationCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import type { Repository, Organization } from "../../types";
import { repositoryAPI, organizationAPI } from "../../services/api";
import { getUser } from "../../utils/auth";

// 가상 조직 인터페이스 (Fork 기반)
interface VirtualOrganization {
  login: string;
  repositories: Repository[];
  isVirtual: boolean;
  avatarUrl?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ 레포지토리 클릭: 실제 owner 사용
  const handleRepositoryClick = (repo: Repository) => {
    const ownerLogin =
      typeof repo.owner === "object" ? repo.owner.login : repo.owner;

    console.log(`레포 클릭: ${ownerLogin}/${repo.name}`);
    navigate(`/analysis/${ownerLogin}/${repo.name}`);
  };

  // ✅ 조직 클릭: 조직 상세 페이지로
  const handleOrganizationClick = (orgLogin: string) => {
    console.log(`조직 클릭: ${orgLogin}`);
    navigate(`/organization/${orgLogin}`);
  };

  // 조직 분류 및 가상 조직 생성
  const realOrganizations = new Set(organizations.map((org) => org.login));
  const virtualOrgsMap = new Map<string, VirtualOrganization>();
  const organizationRepos: Repository[] = [];
  const personalRepos: Repository[] = [];

  repositories.forEach((repo) => {
    const ownerLogin =
      typeof repo.owner === "object" ? repo.owner.login : repo.owner;
    const ownerType = typeof repo.owner === "object" ? repo.owner.type : "User";

    // 실제 조직 소유 레포
    if (ownerType === "Organization") {
      organizationRepos.push(repo);
      return;
    }

    // Fork된 레포 → 가상 조직으로 그룹핑
    if (repo.fork && repo.parent && typeof repo.parent.owner === "object") {
      const parentOrgLogin = repo.parent.owner.login;
      const parentOrgType = repo.parent.owner.type;

      // 원본이 조직인 경우에만
      if (parentOrgType === "Organization") {
        organizationRepos.push(repo);

        // 이미 실제 조직이 아닌 경우에만 가상 조직 생성
        if (!realOrganizations.has(parentOrgLogin)) {
          if (!virtualOrgsMap.has(parentOrgLogin)) {
            virtualOrgsMap.set(parentOrgLogin, {
              login: parentOrgLogin,
              repositories: [],
              isVirtual: true,
              avatarUrl: repo.parent.owner.avatarUrl,
            });
          }
          virtualOrgsMap.get(parentOrgLogin)!.repositories.push(repo);
        }
        return;
      }
    }

    // 개인 레포
    personalRepos.push(repo);
  });

  // 실제 조직 + 가상 조직 합치기
  const allOrganizations = [
    ...organizations.map((org) => ({
      ...org,
      isVirtual: false,
    })),
    ...Array.from(virtualOrgsMap.values()).map((vOrg) => ({
      id: Math.random(), // 임시 ID
      login: vOrg.login,
      avatarUrl: vOrg.avatarUrl,
      description: `${vOrg.repositories.length}개의 Fork된 레포지토리`,
      isVirtual: true,
      publicRepos: vOrg.repositories.length,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
          <p className="text-gray-600">
            조직을 선택하거나 레포지토리를 분석하세요
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

        {!isLoading && !error && repositories.length === 0 && (
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

        {!isLoading && !error && repositories.length > 0 && (
          <>
            {/* 조직 섹션 (실제 + 가상) */}
            {allOrganizations.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />내 조직
                  <span className="text-sm font-normal text-gray-500">
                    ({allOrganizations.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allOrganizations.map((org) => (
                    <OrganizationCard
                      key={org.login}
                      organization={org}
                      onClick={() => handleOrganizationClick(org.login)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 조직/협업 프로젝트 섹션 */}
            {organizationRepos.length > 0 && (
              <section className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🏢 조직 & 협업 프로젝트
                  <span className="text-sm font-normal text-gray-500">
                    ({organizationRepos.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizationRepos.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      onClick={() => handleRepositoryClick(repo)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 개인 프로젝트 섹션 */}
            {personalRepos.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  👤 개인 프로젝트
                  <span className="text-sm font-normal text-gray-500">
                    ({personalRepos.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personalRepos.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repository={repo}
                      onClick={() => handleRepositoryClick(repo)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
