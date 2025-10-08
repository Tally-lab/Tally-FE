import { GitBranch, Lock, Unlock, Calendar } from "lucide-react";
import type { Repository } from "../../types";

interface RepositoryCardProps {
  repository: Repository;
  onClick: () => void;
}

export default function RepositoryCard({
  repository,
  onClick,
}: RepositoryCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {repository.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {repository.fullName}
            </p>
          </div>
          <div className="ml-2">
            {repository.isPrivate ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : (
              <Unlock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {repository.description || "설명이 없습니다."}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {repository.defaultBranch && (
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                <span>{repository.defaultBranch}</span>
              </div>
            )}
          </div>
          {repository.updatedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(repository.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
