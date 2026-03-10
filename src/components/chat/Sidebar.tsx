import { Plus, MessageSquare, Trash2, Sun, Moon, LogOut, X } from 'lucide-react';
import type { Conversation } from '../../types';

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  conversations, activeId, onSelect, onNew, onDelete,
  darkMode, onToggleDark, onLogout, isOpen, onClose,
}: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 flex flex-col
        bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/25">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">DevPulse</h1>
              <p className="text-2xs text-gray-400">Engineering Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={() => { onNew(); onClose(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
          >
            <Plus size={16} />
            새 대화
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {conversations.length === 0 ? (
            <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
              대화가 없습니다
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { onSelect(conv.id); onClose(); }}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeId === conv.id
                    ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
                <span className="flex-1 text-sm truncate">{conv.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom controls */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            {darkMode ? '라이트 모드' : '다크 모드'}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
