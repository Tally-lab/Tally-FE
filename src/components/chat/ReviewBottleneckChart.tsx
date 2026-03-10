import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer,
} from 'recharts';

interface Reviewer {
  name: string;
  reviews: number;
  avgResponseHours: number;
}

interface ReviewBottleneckData {
  repo: string;
  avgReviewTime: string;
  avgMergeTime: string;
  pendingPRs: number;
  reviewers: Reviewer[];
}

function speedColor(hours: number): string {
  if (hours <= 4) return '#10b981';
  if (hours <= 12) return '#3b82f6';
  if (hours <= 24) return '#f59e0b';
  return '#ef4444';
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}분`;
  if (h < 24) return `${h.toFixed(1)}시간`;
  return `${(h / 24).toFixed(1)}일`;
}

export default function ReviewBottleneckChart({ data }: { data: ReviewBottleneckData }) {
  const sorted = [...data.reviewers].sort((a, b) => b.avgResponseHours - a.avgResponseHours);

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        리뷰 병목 — {data.repo}
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">평균 리뷰 시간</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.avgReviewTime}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">평균 머지 시간</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.avgMergeTime}</p>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">대기 중 PR</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.pendingPRs}개</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="min-h-[200px]">
        <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 40 + 40)}>
          <BarChart data={sorted} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => formatHours(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as Reviewer;
                return (
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-gray-500">리뷰 {d.reviews}건</p>
                    <p style={{ color: speedColor(d.avgResponseHours) }}>
                      평균 응답: {formatHours(d.avgResponseHours)}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="avgResponseHours" radius={[0, 4, 4, 0]}>
              {sorted.map((r, i) => (
                <Cell key={i} fill={speedColor(r.avgResponseHours)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
