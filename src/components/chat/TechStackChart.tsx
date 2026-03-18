import { ExternalLink } from 'lucide-react';

interface TechItem {
  name: string;
  version: string;
  docsUrl: string;
  source: string;
}

interface TechCategory {
  category: string;
  items: TechItem[];
}

interface TechStackData {
  repo: string;
  totalCount: number;
  categories: TechCategory[];
}

const CATEGORY_ICONS: Record<string, string> = {
  '언어': '💬',
  '프레임워크': '🏗️',
  '라이브러리': '📦',
  '빌드 도구': '🔧',
  '데이터베이스': '🗄️',
  '인프라': '☁️',
};

const CATEGORY_COLORS: Record<string, string> = {
  '언어': '#6366f1',
  '프레임워크': '#3b82f6',
  '라이브러리': '#10b981',
  '빌드 도구': '#f59e0b',
  '데이터베이스': '#ef4444',
  '인프라': '#8b5cf6',
};

export default function TechStackChart({ data }: { data: TechStackData }) {
  return (
    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          기술 스택 — {data.repo}
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
          {data.totalCount}개 기술
        </span>
      </div>

      <div className="space-y-3">
        {data.categories.map((cat) => {
          const color = CATEGORY_COLORS[cat.category] ?? '#6b7280';
          const icon = CATEGORY_ICONS[cat.category] ?? '📋';

          return (
            <div key={cat.category}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm">{icon}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color }}
                >
                  {cat.category}
                </span>
                <span className="text-[10px] text-gray-400">({cat.items.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {cat.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {item.version && <span className="mr-1.5">{item.version}</span>}
                        <span className="opacity-60">{item.source}</span>
                      </p>
                    </div>
                    <ExternalLink
                      size={12}
                      className="flex-shrink-0 ml-2 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
