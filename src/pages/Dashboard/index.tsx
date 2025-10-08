import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderGit2 } from "lucide-react";
import Header from "../../components/layout/Header";
import RepositoryCard from "../../components/dashboard/RepositoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import type { Repository } from "../../types";

export default function Dashboard() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setIsLoading(true);
      setError("");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockRepos: Repository[] = [
        {
          id: "1",
          name: "Tally-BE",
          fullName: "Tally-lab/Tally-BE",
          description:
            "GitHub 기여도 분석 백엔드 - Spring Boot, GitHub API 연동",
          url: "https://github.com/Tally-lab/Tally-BE",
          owner: "Tally-lab",
          isPrivate: false,
          defaultBranch: "main",
          updatedAt: "2025-10-08T00:00:00Z",
        },
        {
          id: "2",
          name: "Tally-FE",
          fullName: "Tally-lab/Tally-FE",
          description:
            "GitHub 기여도 분석 프론트엔드 - React, TypeScript, Tailwind CSS",
          url: "https://github.com/Tally-lab/Tally-FE",
          owner: "Tally-lab",
          isPrivate: false,
          defaultBranch: "main",
          updatedAt: "2025-10-08T00:00:00Z",
        },
        {
          id: "3",
          name: "my-awesome-project",
          fullName: "username/my-awesome-project",
          description: "멋진 개인 프로젝트 입니다",
          url: "https://github.com/username/my-awesome-project",
          owner: "username",
          isPrivate: true,
          defaultBranch: "develop",
          updatedAt: "2025-10-05T00:00:00Z",
        },
        {
          id: "4",
          name: "algorithm-practice",
          fullName: "username/algorithm-practice",
          description: "알고리즘 문제 풀이 연습",
          url: "https://github.com/username/algorithm-practice",
          owner: "username",
          isPrivate: false,
          defaultBranch: "main",
          updatedAt: "2025-10-01T00:00:00Z",
        },
        {
          id: "5",
          name: "react-component-library",
          fullName: "username/react-component-library",
          description: "재사용 가능한 React 컴포넌트 라이브러리",
          url: "https://github.com/username/react-component-library",
          owner: "username",
          isPrivate: false,
          defaultBranch: "main",
          updatedAt: "2025-09-28T00:00:00Z",
        },
        {
          id: "6",
          name: "data-analysis-toolkit",
          fullName: "username/data-analysis-toolkit",
          description: "Python 기반 데이터 분석 도구 모음",
          url: "https://github.com/username/data-analysis-toolkit",
          owner: "username",
          isPrivate: true,
          defaultBranch: "main",
          updatedAt: "2025-09-20T00:00:00Z",
        },
      ];

      setRepositories(mockRepos);
    } catch (err) {
      console.error("레포지토리 조회 실패:", err);
      setError("레포지토리 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepositoryClick = (repo: Repository) => {
    navigate(`/analysis/${repo.owner}/${repo.name}`);
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
