import type { CommitQualityMetrics } from "../../types";
import QualityGradeBadge from "./QualityGradeBadge";
import { BarChart2, GitCommit, CheckCircle } from "lucide-react";

interface CommitQualityCardProps {
  metrics: CommitQualityMetrics;
}

export default function CommitQualityCard({ metrics }: CommitQualityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <GitCommit className="w-4 h-4 sm:w-5 sm:h-5" />
          커밋 품질 분석
        </h3>
        <QualityGradeBadge grade={metrics.qualityGrade} size="lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            <p className="text-xs sm:text-sm text-gray-600">총 커밋</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{metrics.totalCommits}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            <p className="text-xs sm:text-sm text-gray-600">Conventional 준수율</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {metrics.conventionalCommitRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">평균 커밋 크기</span>
            <span className="text-sm text-gray-600">{metrics.averageCommitSize.toFixed(0)} lines</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min((metrics.averageCommitSize / 500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {metrics.commitTypeDistribution && (
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">커밋 타입 분포</p>
            <div className="space-y-1.5 sm:space-y-2">
              {Object.entries(metrics.commitTypeDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[50px] sm:min-w-[60px] text-center">
                      {type}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-purple-500 h-1.5 sm:h-2 rounded-full"
                        style={{ width: `${(count / metrics.totalCommits) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-600 min-w-[30px] sm:min-w-[40px] text-right">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {metrics.commitSizeDistribution && (
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">커밋 크기 분포</p>
            <div className="grid grid-cols-2 sm:flex gap-2">
              {Object.entries(metrics.commitSizeDistribution).map(([size, count]) => (
                <div key={size} className="flex-1 text-center">
                  <div className="bg-gray-100 rounded-lg p-2 sm:p-2">
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-1 truncate">{size}</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
