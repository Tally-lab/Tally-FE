import { useState, useEffect } from "react";
import { GitPullRequest, AlertCircle, GitCommit } from "lucide-react";
import PRList from "./PRList";
import IssueList from "./IssueList";
import CommitList from "./CommitList";
import type { PullRequest, Issue } from "../../types";

interface Props {
  pullRequests: PullRequest[];
  issues: Issue[];
  commitMessages?: string[];
}

type TabType = "pr" | "issue" | "commit";

export default function ContributionList({ pullRequests, issues, commitMessages = [] }: Props) {
  const totalPRAndIssue = pullRequests.length + issues.length;
  const showCommitsTab = totalPRAndIssue <= 3 && commitMessages.length > 0;

  // PR + Issue가 3개 이하이면 커밋 탭을 기본으로 선택
  const [activeTab, setActiveTab] = useState<TabType>(showCommitsTab ? "commit" : "pr");

  // props 변경시 탭 상태 업데이트
  useEffect(() => {
    if (showCommitsTab && activeTab !== "commit") {
      setActiveTab("commit");
    } else if (!showCommitsTab && activeTab === "commit") {
      setActiveTab("pr");
    }
  }, [showCommitsTab]);

  return (
    <div className="card">
      <div className="flex border-b border-gray-200 mb-4">
        {showCommitsTab && (
          <button
            onClick={() => setActiveTab("commit")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "commit"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <GitCommit className="w-4 h-4" />
              <span>Commits ({commitMessages.length})</span>
            </div>
          </button>
        )}

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
        {activeTab === "commit" ? (
          <CommitList items={commitMessages} />
        ) : activeTab === "pr" ? (
          <PRList items={pullRequests} />
        ) : (
          <IssueList items={issues} />
        )}
      </div>
    </div>
  );
}
