import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * 역할 분포 데이터 인터페이스
 */
interface RoleDistributionChartProps {
  data: {
    backend: number; // 백엔드 커밋 수
    frontend: number; // 프론트엔드 커밋 수
    infrastructure: number; // 인프라 커밋 수
    test: number; // 테스트 커밋 수
    documentation: number; // 문서 커밋 수
    configuration: number; // 설정 커밋 수
    other: number; // 기타 커밋 수
  };
}

/**
 * 역할별 기여도를 막대 그래프로 시각화하는 컴포넌트
 * Recharts 라이브러리를 사용하여 반응형 차트 생성
 *
 * @example
 * <RoleDistributionChart data={{
 *   backend: 65,
 *   frontend: 20,
 *   infrastructure: 10,
 *   test: 5,
 *   documentation: 0,
 *   configuration: 0,
 *   other: 0
 * }} />
 */
export default function RoleDistributionChart({
  data,
}: RoleDistributionChartProps) {
  // 차트 데이터 변환: 0이 아닌 값만 필터링하고 색상 추가
  const chartData = [
    { name: "백엔드", value: data.backend, color: "#5b75ff" },
    { name: "프론트엔드", value: data.frontend, color: "#a855f7" },
    { name: "인프라", value: data.infrastructure, color: "#6b7280" },
    { name: "테스트", value: data.test, color: "#10b981" },
    { name: "문서", value: data.documentation, color: "#f59e0b" },
    { name: "설정", value: data.configuration, color: "#8b5cf6" },
    { name: "기타", value: data.other, color: "#94a3b8" },
  ].filter((item) => item.value > 0); // 값이 0인 항목 제외

  return (
    <div className="card">
      {/* 차트 제목 */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        역할별 기여도 분석
      </h3>

      {/* Recharts 반응형 컨테이너 */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          {/* 배경 그리드 */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X축: 역할 이름 */}
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />

          {/* Y축: 커밋 수 */}
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{
              value: "커밋 수",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12 },
            }}
          />

          {/* 툴팁: 마우스 호버 시 상세 정보 표시 */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "14px",
            }}
            formatter={(value: number) => [`${value}개`, "커밋"]}
          />

          {/* 막대 그래프: 상단 모서리 둥글게 */}
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {/* 각 막대에 개별 색상 적용 */}
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
