import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

interface Role {
  name: string;
  commits: number;
  percentage: number;
}

interface RoleDistributionData {
  repo: string;
  username: string;
  roles: Role[];
}

const ROLE_COLORS: Record<string, string> = {
  feature: '#6366f1',
  bugfix: '#ef4444',
  fix: '#ef4444',
  refactoring: '#8b5cf6',
  refactor: '#8b5cf6',
  documentation: '#10b981',
  docs: '#10b981',
  infrastructure: '#f59e0b',
  infra: '#f59e0b',
  test: '#3b82f6',
  other: '#9ca3af',
};

const ROLE_LABELS: Record<string, string> = {
  feature: '기능 개발',
  bugfix: '버그 수정',
  fix: '버그 수정',
  refactoring: '리팩토링',
  refactor: '리팩토링',
  documentation: '문서화',
  docs: '문서화',
  infrastructure: '인프라',
  infra: '인프라',
  test: '테스트',
  other: '기타',
};

const fallbackColor = (name: string, i: number) =>
  ROLE_COLORS[name.toLowerCase()] ??
  ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6];

export default function RoleDistributionChart({ data }: { data: RoleDistributionData }) {
  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        작업 유형 분포 — {data.repo} ({data.username})
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Donut Chart */}
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.roles}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.roles.map((r, i) => (
                  <Cell key={r.name} fill={fallbackColor(r.name, i)} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as Role;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <p className="font-semibold">
                        {ROLE_LABELS[d.name.toLowerCase()] ?? d.name}
                      </p>
                      <p className="text-gray-500">{d.commits}커밋 ({d.percentage}%)</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Role List */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {data.roles.map((r, i) => (
            <div key={r.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: fallbackColor(r.name, i) }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 w-20">
                {ROLE_LABELS[r.name.toLowerCase()] ?? r.name}
              </span>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${r.percentage}%`,
                    backgroundColor: fallbackColor(r.name, i),
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20 text-right">
                {r.commits}개 ({r.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
