import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  GitCommit,
  GitBranch,
  Percent,
} from "lucide-react";
import Header from "../../components/layout/Header";
import StatsCard from "../../components/analysis/StatsCard";
import RoleDistributionChart from "../../components/analysis/RoleDistributionChart";
import ContributionList from "../../components/analysis/ContributionList";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import type { ContributionStats, PullRequest, Issue } from "../../types";
import { analysisAPI } from "../../services/api";

export default function Analysis() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();

  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      const markdownContent = await analysisAPI.downloadMarkdownReport(
        owner,
        repo,
        username
      );

      // Blob 생성 및 다운로드
      const blob = new Blob([markdownContent], { type: "text/markdown" });
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
      const htmlContent = await analysisAPI.downloadHtmlReport(
        owner,
        repo,
        username
      );

      // Blob 생성 및 다운로드
      const blob = new Blob([htmlContent], { type: "text/html" });
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

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {repo} 분석 결과
            </h2>
            <p className="text-gray-600">{owner}의 기여도 분석</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadMarkdown}
              disabled={isDownloading}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "다운로드 중..." : "Markdown"}
            </button>
            <button
              onClick={handleDownloadHTML}
              disabled={isDownloading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "다운로드 중..." : "HTML"}
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

        <ContributionList pullRequests={pullRequests} issues={issues} />
      </div>
    </div>
  );
}
