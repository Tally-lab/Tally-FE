import { GitPullRequest, XCircle, GitMerge, ExternalLink } from "lucide-react";

interface PullRequest {
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  closedAt?: string;
  mergedAt?: string;
}

interface Props {
  items: PullRequest[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR");
}

export default function PRList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <GitPullRequest className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Pull Request가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((pr) => {
        const isMerged = Boolean(pr.mergedAt);
        const isClosed = pr.state === "closed";
        return (
          <a
            key={pr.number}
            href={pr.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {isMerged ? (
                  <GitMerge className="w-5 h-5 text-purple-600" />
                ) : isClosed ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <GitPullRequest className="w-5 h-5 text-green-600" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
                    #{pr.number} {pr.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(pr.createdAt)}
                    {pr.mergedAt && ` • Merged ${formatDate(pr.mergedAt)}`}
                    {!pr.mergedAt &&
                      pr.closedAt &&
                      ` • Closed ${formatDate(pr.closedAt)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    isMerged
                      ? "px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      : isClosed
                      ? "px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800"
                      : "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                  }
                >
                  {isMerged ? "Merged" : isClosed ? "Closed" : "Open"}
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
