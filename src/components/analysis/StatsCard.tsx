import type { LucideIcon } from "lucide-react";

/**
 * 통계 카드 컴포넌트 Props
 */
interface StatsCardProps {
  icon: LucideIcon; // 표시할 아이콘
  label: string; // 통계 레이블 (예: "총 커밋 수")
  value: string | number; // 메인 값 (예: 150)
  subValue?: string; // 부가 정보 (예: "전체의 58%")
  color?: string; // 아이콘 배경 색상 테마
}

/**
 * 분석 통계를 카드 형태로 표시하는 컴포넌트
 *
 * @example
 * <StatsCard
 *   icon={GitCommit}
 *   label="총 커밋 수"
 *   value={150}
 *   subValue="전체 프로젝트"
 *   color="primary"
 * />
 */
export default function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  color = "primary",
}: StatsCardProps) {
  // 색상 테마별 클래스 매핑
  const colorClasses = {
    primary: "bg-primary-50 text-primary-600",
    secondary: "bg-secondary-50 text-secondary-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* 텍스트 영역 */}
        <div className="flex-1">
          {/* 레이블 */}
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          {/* 메인 값 */}
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {/* 부가 정보 (선택) */}
          {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
        </div>

        {/* 아이콘 영역 */}
        <div
          className={`w-12 h-12 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses] ||
            colorClasses.primary
          } flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
