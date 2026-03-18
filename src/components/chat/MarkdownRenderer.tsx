import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DoraChart from './DoraChart';
import BusFactorChart from './BusFactorChart';
import BurnoutChart from './BurnoutChart';
import CommitQualityChart from './CommitQualityChart';
import ReviewBottleneckChart from './ReviewBottleneckChart';
import CompareReposChart from './CompareReposChart';
import RoleDistributionChart from './RoleDistributionChart';
import TechStackChart from './TechStackChart';

interface Props {
  content: string;
}

function normalizeMarkdown(raw: string): string {
  return raw
    .replace(/([^\n])\n---/g, '$1\n\n---')
    .replace(/---\n([^\n])/g, '---\n\n$1')
    .replace(/([^\n-*\d])\n([-*] )/g, '$1\n\n$2')
    .replace(/([^\n])\n(\*\*[^*]+\*\*)/g, '$1\n\n$2')
    .replace(/(\*\*[^*]+\*\*[^\n]*)\n([-*] )/g, '$1\n\n$2');
}

type ChartType = 'dora' | 'busfactor' | 'burnout' | 'commitquality' | 'reviewbottleneck' | 'comparerepos' | 'roledistr' | 'techstack';

interface ChartEntry {
  type: ChartType;
  data: unknown;
  index: number;
}

// Extract balanced JSON object starting from { at startIdx
function extractBalancedJson(text: string, startIdx: number): string | null {
  if (text[startIdx] !== '{') return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{' || ch === '[') depth++;
    if (ch === '}' || ch === ']') depth--;
    if (depth === 0) return text.substring(startIdx, i + 1);
  }
  return null;
}

// Chart prefix → type mapping + JSON shape validator
const CHART_CONFIGS: { label: string; type: ChartType; validate: (d: Record<string, unknown>) => boolean }[] = [
  {
    label: 'DORA_CHART',
    type: 'dora',
    validate: (d) => !!d.repo && !!d.metrics,
  },
  {
    label: 'BUSFACTOR_CHART',
    type: 'busfactor',
    validate: (d) => !!d.repo && !!d.contributors && d.busFactor !== undefined,
  },
  {
    label: 'BURNOUT_CHART',
    type: 'burnout',
    validate: (d) => !!d.repo && Array.isArray(d.contributors),
  },
  {
    label: 'COMMITQUALITY_CHART',
    type: 'commitquality',
    validate: (d) => !!d.repo && !!d.types && d.grade !== undefined,
  },
  {
    label: 'REVIEWBOTTLENECK_CHART',
    type: 'reviewbottleneck',
    validate: (d) => !!d.repo && !!d.reviewers,
  },
  {
    label: 'COMPAREREPOS_CHART',
    type: 'comparerepos',
    validate: (d) => !!d.repos && Array.isArray(d.repos),
  },
  {
    label: 'ROLEDISTR_CHART',
    type: 'roledistr',
    validate: (d) => !!d.repo && !!d.roles,
  },
  {
    label: 'TECHSTACK_CHART',
    type: 'techstack',
    validate: (d) => !!d.repo && Array.isArray(d.categories),
  },
];

function extractCharts(content: string): { text: string; charts: ChartEntry[] } {
  const charts: ChartEntry[] = [];
  let idx = 0;
  let text = content;

  // 1. Backtick code block format (DORA only — legacy)
  text = text.replace(/```\s*chart[:\s]?dora\s*\n?([\s\S]*?)```/gi, (_match, json) => {
    try {
      const data = JSON.parse(json.trim());
      if (data.repo && data.metrics) {
        const placeholder = `\n\n<!--chart:${idx}-->\n\n`;
        charts.push({ type: 'dora', data, index: idx++ });
        return placeholder;
      }
    } catch { /* fall through */ }
    return _match;
  });

  // 2. PREFIX_CHART format — bracket-balanced JSON extraction
  for (const { label, type, validate } of CHART_CONFIGS) {
    // Match "LABEL:" or "LABEL" followed by optional whitespace and {
    const prefixRe = new RegExp(label + ':?\\s*\\{', 'g');
    let match;
    const replacements: { start: number; end: number; placeholder: string }[] = [];

    while ((match = prefixRe.exec(text)) !== null) {
      const jsonStart = text.indexOf('{', match.index);
      if (jsonStart === -1) continue;

      const jsonStr = extractBalancedJson(text, jsonStart);
      if (!jsonStr) continue;

      try {
        const data = JSON.parse(jsonStr);
        if (validate(data as Record<string, unknown>)) {
          const placeholder = `\n\n<!--chart:${idx}-->\n\n`;
          charts.push({ type, data, index: idx++ });
          replacements.push({
            start: match.index,
            end: jsonStart + jsonStr.length,
            placeholder,
          });
        }
      } catch { /* fall through */ }
    }

    // Apply replacements in reverse order to preserve indices
    for (let i = replacements.length - 1; i >= 0; i--) {
      const r = replacements[i];
      text = text.substring(0, r.start) + r.placeholder + text.substring(r.end);
    }
  }

  // 3. "chart:dora" or "chartdora" prefix (legacy fallback)
  text = text.replace(/chart\s*[:\s]?\s*dora\s*\n?\s*\{/gi, (match, offset) => {
    const jsonStart = text.indexOf('{', offset);
    if (jsonStart === -1) return match;
    const jsonStr = extractBalancedJson(text, jsonStart);
    if (!jsonStr) return match;
    try {
      const data = JSON.parse(jsonStr);
      if (data.repo && data.metrics) {
        const placeholder = `\n\n<!--chart:${idx}-->\n\n`;
        charts.push({ type: 'dora', data, index: idx++ });
        // Return placeholder for the prefix part; the JSON part is handled by substring
        return placeholder;
      }
    } catch { /* fall through */ }
    return match;
  });

  // 4. Bare DORA JSON (last resort) — look for {"repo":...,"overall":...,"metrics":...}
  if (charts.filter((c) => c.type === 'dora').length === 0) {
    const bareRe = /\{"repo":\s*"[^"]+"/g;
    let bareMatch;
    const replacements: { start: number; end: number; placeholder: string }[] = [];

    while ((bareMatch = bareRe.exec(text)) !== null) {
      const jsonStr = extractBalancedJson(text, bareMatch.index);
      if (!jsonStr) continue;
      try {
        const data = JSON.parse(jsonStr);
        if (data.repo && data.metrics && data.overall) {
          const placeholder = `\n\n<!--chart:${idx}-->\n\n`;
          charts.push({ type: 'dora', data, index: idx++ });
          replacements.push({ start: bareMatch.index, end: bareMatch.index + jsonStr.length, placeholder });
        }
      } catch { /* fall through */ }
    }

    for (let i = replacements.length - 1; i >= 0; i--) {
      const r = replacements[i];
      text = text.substring(0, r.start) + r.placeholder + text.substring(r.end);
    }
  }

  return { text, charts };
}

function renderChart(chart: ChartEntry, key: string) {
  switch (chart.type) {
    case 'dora':
      return <DoraChart key={key} data={chart.data as never} />;
    case 'busfactor':
      return <BusFactorChart key={key} data={chart.data as never} />;
    case 'burnout':
      return <BurnoutChart key={key} data={chart.data as never} />;
    case 'commitquality':
      return <CommitQualityChart key={key} data={chart.data as never} />;
    case 'reviewbottleneck':
      return <ReviewBottleneckChart key={key} data={chart.data as never} />;
    case 'comparerepos':
      return <CompareReposChart key={key} data={chart.data as never} />;
    case 'roledistr':
      return <RoleDistributionChart key={key} data={chart.data as never} />;
    case 'techstack':
      return <TechStackChart key={key} data={chart.data as never} />;
    default:
      return null;
  }
}

export default function MarkdownRenderer({ content }: Props) {
  if (!content) return null;

  const { text, charts } = extractCharts(content);
  const normalized = normalizeMarkdown(text);

  if (charts.length === 0) {
    return (
      <div className="prose-chat">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {normalized}
        </ReactMarkdown>
      </div>
    );
  }

  const parts = normalized.split(/<!--chart:(\d+)-->/);

  return (
    <div className="prose-chat">
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part.trim() ? (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
              {part}
            </ReactMarkdown>
          ) : null;
        }

        const chartIdx = parseInt(part, 10);
        const chart = charts.find((c) => c.index === chartIdx);
        if (!chart) return null;

        return renderChart(chart, `chart-${i}`);
      })}
    </div>
  );
}
