import {
  GitCommit,
  Folder,
  TrendingUp,
  GitPullRequest,
  AlertCircle,
} from "lucide-react";
import type { OrganizationStats as OrgStatsType } from "../../types";

interface OrganizationStatsProps {
  stats: OrgStatsType;
}

export default function OrganizationStats({ stats }: OrganizationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 전체 기여도 */}
      <div className="card bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              전체 기여도
            </p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.contributionPercentage}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {stats.userCommits} / {stats.totalCommits} 커밋
        </p>
      </div>

      {/* 기여 레포지토리 수 */}
      <div className="card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              기여 레포지토리
            </p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalRepositories}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Folder className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500">활발히 참여 중</p>
      </div>

      {/* 내 커밋 수 */}
      <div className="card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">내 커밋</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.userCommits}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <GitCommit className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500">전체 {stats.totalCommits} 중</p>
      </div>

      {/* Pull Request & Issue */}
      <div className="card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">PR & Issue</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalPullRequests + stats.totalIssues}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <GitPullRequest className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          PR {stats.totalPullRequests} · Issue {stats.totalIssues}
        </p>
      </div>
    </div>
  );
}
