interface ContributorBurnout {
  name: string;
  risk: string;
  nightPercent: number;
  weekendPercent: number;
  hourly: number[];
}

interface BurnoutData {
  repo: string;
  contributors: ContributorBurnout[];
}

const RISK_CONFIG: Record<string, { color: string; bg: string }> = {
  '높음': { color: '#ef4444', bg: '#ef444420' },
  '주의': { color: '#f59e0b', bg: '#f59e0b20' },
  '정상': { color: '#10b981', bg: '#10b98120' },
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function heatColor(value: number, max: number): string {
  if (max === 0 || value === 0) return 'bg-gray-100 dark:bg-gray-800';
  const ratio = value / max;
  if (ratio > 0.7) return 'bg-red-500';
  if (ratio > 0.4) return 'bg-amber-400';
  if (ratio > 0.15) return 'bg-emerald-400';
  return 'bg-emerald-200 dark:bg-emerald-900';
}

export default function BurnoutChart({ data }: { data: BurnoutData }) {
  const globalMax = Math.max(...data.contributors.flatMap((c) => c.hourly), 1);

  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        번아웃 위험도 — {data.repo}
      </h3>

      {/* Risk Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.contributors.map((c) => {
          const cfg = RISK_CONFIG[c.risk] ?? RISK_CONFIG['정상'];
          return (
            <div
              key={c.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              <span className="font-semibold">{c.name}</span>
              <span>{c.risk}</span>
              <span className="text-[10px] opacity-80">
                야간 {c.nightPercent}% · 주말 {c.weekendPercent}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex gap-px ml-24 mb-1">
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[9px] text-gray-400"
              >
                {h % 3 === 0 ? `${h}시` : ''}
              </div>
            ))}
          </div>

          {/* Rows */}
          {data.contributors.map((c) => (
            <div key={c.name} className="flex items-center gap-1 mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-24 truncate text-right pr-2">
                {c.name}
              </span>
              <div className="flex gap-px flex-1">
                {c.hourly.map((val, h) => (
                  <div
                    key={h}
                    className={`flex-1 h-5 rounded-sm ${heatColor(val, globalMax)} transition-colors`}
                    title={`${c.name} ${h}시: ${val}커밋`}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[10px] text-gray-400 mr-1">적음</span>
            <div className="w-4 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-4 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
            <div className="w-4 h-3 rounded-sm bg-emerald-400" />
            <div className="w-4 h-3 rounded-sm bg-amber-400" />
            <div className="w-4 h-3 rounded-sm bg-red-500" />
            <span className="text-[10px] text-gray-400 ml-1">많음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
