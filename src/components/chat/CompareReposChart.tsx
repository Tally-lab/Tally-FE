import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface RepoStat {
  name: string;
  commits: number;
  prs: number;
  conventionalRate: number;
  prMergeRate: number;
  commitGrade: string;
}

interface CompareReposData {
  username: string;
  repos: RepoStat[];
}

const METRIC_COLORS = {
  commits: '#6366f1',
  prs: '#3b82f6',
  conventionalRate: '#10b981',
  prMergeRate: '#f59e0b',
};

const GRADE_COLORS: Record<string, string> = {
  A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444',
};

export default function CompareReposChart({ data }: { data: CompareReposData }) {
  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        레포 비교 — {data.username}
      </h3>

      {/* Activity Chart (commits & PRs) */}
      <div className="min-h-[200px] mb-4">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 ml-1">활동량</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.repos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-semibold mb-1">{label}</p>
                    {payload.map((p) => (
                      <p key={p.dataKey as string} style={{ color: p.color }}>
                        {p.dataKey === 'commits' ? '커밋' : 'PR'}: {p.value}개
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value: string) => (value === 'commits' ? '커밋' : 'PR')}
            />
            <Bar dataKey="commits" fill={METRIC_COLORS.commits} radius={[4, 4, 0, 0]} />
            <Bar dataKey="prs" fill={METRIC_COLORS.prs} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quality Chart (rates) */}
      <div className="min-h-[200px]">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 ml-1">품질 지표 (%)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.repos}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                    <p className="font-semibold mb-1">{label}</p>
                    {payload.map((p) => (
                      <p key={p.dataKey as string} style={{ color: p.color }}>
                        {p.dataKey === 'conventionalRate' ? 'Conventional 준수율' : 'PR 머지율'}:{' '}
                        {p.value}%
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value: string) =>
                value === 'conventionalRate' ? 'Conventional 준수율' : 'PR 머지율'
              }
            />
            <Bar dataKey="conventionalRate" fill={METRIC_COLORS.conventionalRate} radius={[4, 4, 0, 0]} />
            <Bar dataKey="prMergeRate" fill={METRIC_COLORS.prMergeRate} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Badges */}
      <div className="flex flex-wrap gap-2 mt-3">
        {data.repos.map((r) => (
          <span
            key={r.name}
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: (GRADE_COLORS[r.commitGrade] ?? '#9ca3af') + '20',
              color: GRADE_COLORS[r.commitGrade] ?? '#9ca3af',
            }}
          >
            {r.name}: {r.commitGrade}
          </span>
        ))}
      </div>
    </div>
  );
}
