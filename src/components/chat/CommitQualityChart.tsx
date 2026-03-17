import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

interface CommitType {
  name: string;
  count: number;
}

interface CommitQualityData {
  repo: string;
  grade: string;
  totalCommits: number;
  conventionalRate: number;
  types: CommitType[];
}

const TYPE_COLORS: Record<string, string> = {
  feat: '#6366f1',
  fix: '#ef4444',
  refactor: '#8b5cf6',
  docs: '#10b981',
  test: '#f59e0b',
  chore: '#64748b',
  style: '#ec4899',
  perf: '#14b8a6',
  ci: '#06b6d4',
  build: '#a855f7',
  other: '#9ca3af',
};

const GRADE_COLORS: Record<string, string> = {
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#f97316',
  F: '#ef4444',
};

const fallbackColor = (name: string, i: number) =>
  TYPE_COLORS[name.toLowerCase()] ??
  ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6];

export default function CommitQualityChart({ data }: { data: CommitQualityData }) {
  const gradeColor = GRADE_COLORS[data.grade] ?? '#9ca3af';

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          작업 기록 품질 — {data.repo}
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: gradeColor + '20', color: gradeColor }}
        >
          등급 {data.grade}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Pie Chart */}
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.types}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.types.map((t, i) => (
                  <Cell key={t.name} fill={fallbackColor(t.name, i)} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as CommitType;
                  const total = data.types.reduce((s, t) => s + t.count, 0);
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-gray-500">{d.count}개 ({(d.count / total * 100).toFixed(0)}%)</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">총 커밋</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {data.totalCommits}개
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">커밋 규칙 준수율</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {data.conventionalRate}%
              </p>
            </div>
          </div>
          {data.types.map((t, i) => {
            const total = data.types.reduce((s, x) => s + x.count, 0);
            return (
              <div key={t.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: fallbackColor(t.name, i) }}
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">{t.name}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {t.count}개 ({(t.count / total * 100).toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
