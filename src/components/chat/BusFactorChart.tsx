import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

interface Contributor {
  name: string;
  commits: number;
  percentage: number;
}

interface BusFactorData {
  repo: string;
  busFactor: number;
  contributors: Contributor[];
}

const PALETTE = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const riskColor = (bf: number) =>
  bf >= 4 ? '#10b981' : bf >= 3 ? '#3b82f6' : bf >= 2 ? '#f59e0b' : '#ef4444';

const riskLabel = (bf: number) =>
  bf >= 4 ? '양호' : bf >= 3 ? '보통' : bf >= 2 ? '주의' : '위험';

export default function BusFactorChart({ data }: { data: BusFactorData }) {
  const color = riskColor(data.busFactor);

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          코드 의존도 — {data.repo}
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: color + '20', color }}
        >
          핵심 기여자 수: {data.busFactor}명 ({riskLabel(data.busFactor)})
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Donut Chart */}
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.contributors}
                dataKey="percentage"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.contributors.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as Contributor;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-gray-500">{d.commits}커밋 ({d.percentage}%)</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Contributor List */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {data.contributors.map((c, i) => (
            <div key={c.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 w-24 truncate">
                {c.name}
              </span>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${c.percentage}%`,
                    backgroundColor: PALETTE[i % PALETTE.length],
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-16 text-right">
                {c.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
