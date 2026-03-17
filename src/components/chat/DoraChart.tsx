import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, Legend,
} from 'recharts';

interface DoraMetric {
  name: string;
  value: number;
  grade: string;
  display: string;
  elite: string;
}

interface DoraData {
  metrics: DoraMetric[];
  overall: string;
  repo: string;
}

const GRADE_COLORS: Record<string, string> = {
  Elite: '#10b981',
  High: '#3b82f6',
  Medium: '#f59e0b',
  Low: '#ef4444',
  'N/A': '#9ca3af',
};

const GRADE_SCORE: Record<string, number> = {
  Elite: 100,
  High: 75,
  Medium: 50,
  Low: 25,
  'N/A': 0,
};

export default function DoraChart({ data }: { data: DoraData }) {
  const radarData = data.metrics.map((m) => ({
    subject: m.name,
    score: GRADE_SCORE[m.grade] ?? 0,
    fullMark: 100,
  }));

  const barData = data.metrics.map((m) => ({
    name: m.name,
    score: GRADE_SCORE[m.grade] ?? 0,
    grade: m.grade,
    display: m.display,
    elite: m.elite,
  }));

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          개발 속도와 안정성 — {data.repo}
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: GRADE_COLORS[data.overall] + '20',
            color: GRADE_COLORS[data.overall],
          }}
        >
          {data.overall}
        </span>
      </div>

      {/* Radar Chart */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#6b7280', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9 }}
                tickCount={5}
              />
              <Radar
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-gray-500">{d.display}</p>
                      <p style={{ color: GRADE_COLORS[d.grade] }}>
                        등급: {d.grade}
                      </p>
                      <p className="text-gray-400">최고 등급 기준: {d.elite}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={GRADE_COLORS[entry.grade]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        {data.metrics.map((m) => (
          <div
            key={m.name}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5">
              {m.name}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {m.display}
            </p>
            <p
              className="text-[11px] font-medium mt-0.5"
              style={{ color: GRADE_COLORS[m.grade] }}
            >
              {m.grade}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
