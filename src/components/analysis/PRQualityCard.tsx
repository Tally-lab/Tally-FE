import type { PRQualityMetrics } from "../../types";
import QualityGradeBadge from "./QualityGradeBadge";
import { GitPullRequest, Clock, CheckCircle2, XCircle } from "lucide-react";

interface PRQualityCardProps {
  metrics: PRQualityMetrics;
}

export default function PRQualityCard({ metrics }: PRQualityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <GitPullRequest className="w-5 h-5" />
          PR 품질 분석
        </h3>
        <QualityGradeBadge grade={metrics.qualityGrade} size="lg" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">총 PR</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalPRs}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <p className="text-xs text-gray-600">머지됨</p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {metrics.mergedPRs}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-1 mb-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <p className="text-xs text-gray-600">닫힘</p>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {metrics.closedWithoutMergePRs}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              머지 성공률
            </span>
            <span className="text-sm text-gray-600">
              {metrics.mergeRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                metrics.mergeRate >= 80
                  ? "bg-green-500"
                  : metrics.mergeRate >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${metrics.mergeRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              평균 리뷰 시간
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {metrics.averageReviewTimeHours.toFixed(1)} 시간
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.averageReviewTimeHours < 24
              ? "✨ 빠른 리뷰"
              : metrics.averageReviewTimeHours < 48
              ? "⚡ 양호한 리뷰 속도"
              : "⏰ 리뷰 속도 개선 필요"}
          </p>
        </div>

        {metrics.prSizeDistribution &&
          Object.keys(metrics.prSizeDistribution).length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                PR 크기 분포
              </p>
              <div className="flex gap-2">
                {Object.entries(metrics.prSizeDistribution).map(
                  ([size, count]) => (
                    <div key={size} className="flex-1 text-center">
                      <div className="bg-gray-100 rounded-lg p-2">
                        <p className="text-xs text-gray-600 mb-1">{size}</p>
                        <p className="text-lg font-bold text-gray-900">
                          {count}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {metrics.averageReviewsPerPR > 0 && (
          <div className="flex justify-between items-center bg-purple-50 rounded-lg p-3">
            <span className="text-sm text-gray-700">PR당 평균 리뷰 수</span>
            <span className="text-lg font-bold text-purple-700">
              {metrics.averageReviewsPerPR.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
