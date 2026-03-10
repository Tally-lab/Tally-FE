import { User, Bot } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import type { ChatMessage as ChatMessageType } from '../../types';

interface Props {
  message: ChatMessageType;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-dot" />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-dot [animation-delay:0.2s]" />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-dot [animation-delay:0.4s]" />
    </div>
  );
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`animate-fade-up ${isUser ? '' : ''}`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className={`flex gap-3 py-5 ${isUser ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400'
              : 'bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/20'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Content */}
          <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}>
            <span className="text-2xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 block">
              {isUser ? 'You' : 'DevPulse'}
            </span>
            <div className={`inline-block text-left ${
              isUser
                ? 'bg-brand-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[85%]'
                : 'text-gray-800 dark:text-gray-200 max-w-full'
            }`}>
              {isUser ? (
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              ) : message.isStreaming && !message.content ? (
                <TypingIndicator />
              ) : (
                <MarkdownRenderer content={message.content} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
