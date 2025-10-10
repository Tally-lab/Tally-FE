import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderGit2 } from "lucide-react";
import Header from "../../components/layout/Header";
import RepositoryCard from "../../components/dashboard/RepositoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import type { Repository } from "../../types";
import { repositoryAPI } from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 실제 백엔드 API 호출
      const repos = await repositoryAPI.getUserRepositories();
      setRepositories(repos);
    } catch (err: any) {
      console.error("레포지토리 조회 실패:", err);

      // 에러 메시지 세분화
      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 429) {
        setError(
          "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (err.code === "ECONNABORTED") {
        setError("요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.");
      } else {
        setError("레포지토리 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositoryClick = (repo: Repository) => {
    // ✅ owner가 객체면 login 추출, 문자열이면 그대로 사용
    const ownerLogin =
      typeof repo.owner === "object" ? repo.owner.login : repo.owner;
    navigate(`/analysis/${ownerLogin}/${repo.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            내 레포지토리
          </h2>
          <p className="text-gray-600">분석할 레포지토리를 선택하세요</p>
        </div>

        {isLoading && (
          <LoadingSpinner size="lg" text="레포지토리 목록을 불러오는 중..." />
        )}

        {error && !isLoading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchRepositories}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !error && repositories.length === 0 && (
          <EmptyState
            icon={FolderGit2}
            title="레포지토리가 없습니다"
            description="GitHub 계정에 레포지토리가 없거나 권한이 없습니다."
            action={{
              label: "새로고침",
              onClick: fetchRepositories,
            }}
          />
        )}

        {!isLoading && !error && repositories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onClick={() => handleRepositoryClick(repo)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
