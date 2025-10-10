import { useState } from "react";
import { GitPullRequest, AlertCircle } from "lucide-react";
import PRList from "./PRList";
import IssueList from "./IssueList";
import type { PullRequest, Issue } from "../../types";

interface Props {
  pullRequests: PullRequest[];
  issues: Issue[];
}

export default function ContributionList({ pullRequests, issues }: Props) {
  const [activeTab, setActiveTab] = useState<"pr" | "issue">("pr");

  return (
    <div className="card">
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("pr")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "pr"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <GitPullRequest className="w-4 h-4" />
            <span>Pull Requests ({pullRequests.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("issue")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "issue"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Issues ({issues.length})</span>
          </div>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeTab === "pr" ? (
          <PRList items={pullRequests} />
        ) : (
          <IssueList items={issues} />
        )}
      </div>
    </div>
  );
}
