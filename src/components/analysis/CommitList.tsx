import { GitCommit } from "lucide-react";

interface Props {
  items: string[];
}

export default function CommitList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <GitCommit className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>커밋 메시지가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((message, index) => (
        <div
          key={index}
          className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <GitCommit className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 break-words">{message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
