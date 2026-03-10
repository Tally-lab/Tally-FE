import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/30 transition-all">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none py-1.5 max-h-[200px]"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className="flex-shrink-0 p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 mb-0.5"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-2xs text-gray-400 dark:text-gray-600 mt-2">
          Enter로 전송 | Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  );
}
