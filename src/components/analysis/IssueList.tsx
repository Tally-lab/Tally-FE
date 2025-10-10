import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface Issue {
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  closedAt?: string;
}

interface Props {
  items: Issue[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR");
}

export default function IssueList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Issue가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((issue) => {
        const isClosed = issue.state === "closed";
        return (
          <a
            key={issue.number}
            href={issue.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {isClosed ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-green-600" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
                    #{issue.number} {issue.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(issue.createdAt)}
                    {issue.closedAt &&
                      ` • Closed ${formatDate(issue.closedAt)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    isClosed
                      ? "px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      : "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                  }
                >
                  {isClosed ? "Closed" : "Open"}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
