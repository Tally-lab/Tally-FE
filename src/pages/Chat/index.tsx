import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bot, Sparkles, GitBranch, Activity, FileSearch } from 'lucide-react';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import Sidebar from '../../components/chat/Sidebar';
import { chatAPI } from '../../services/api';
import { getAccessToken, logout as authLogout } from '../../utils/auth';
import type { ChatMessage as ChatMessageType, Conversation } from '../../types';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
}

const CONVERSATIONS_KEY = 'devpulse_conversations';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

const SUGGESTED_PROMPTS = [
  { icon: GitBranch, text: '내 레포지토리 목록 보여줘', color: 'text-blue-500' },
  { icon: Activity, text: '우리 팀 건강 상태 진단해줘', color: 'text-green-500' },
  { icon: FileSearch, text: 'Tally-BE 커밋 품질 분석해줘', color: 'text-amber-500' },
  { icon: Sparkles, text: 'DORA 메트릭 계산해줘', color: 'text-brand-500' },
];

export default function Chat({ darkMode, onToggleDark }: Props) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;
  const messages = activeConv?.messages || [];

  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const createConversation = (firstMessage: string): string => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: firstMessage.slice(0, 40) + (firstMessage.length > 40 ? '...' : ''),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(id);
    return id;
  };

  const addMessage = (convId: string, message: ChatMessageType) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, message], updatedAt: Date.now() }
          : c
      )
    );
  };

  const updateLastAssistantMessage = (convId: string, content: string, isStreaming: boolean) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = [...c.messages];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
          msgs[lastIdx] = { ...msgs[lastIdx], content, isStreaming };
        }
        return { ...c, messages: msgs, updatedAt: Date.now() };
      })
    );
  };

  const handleSend = async (text: string) => {
    const token = getAccessToken();
    if (!token) {
      navigate('/');
      return;
    }

    const convId = activeConvId || createConversation(text);

    // Add user message
    const userMsg: ChatMessageType = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(convId, userMsg);

    // Add placeholder assistant message
    const assistantMsg: ChatMessageType = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };
    addMessage(convId, assistantMsg);

    setIsStreaming(true);
    streamingContentRef.current = '';

    await chatAPI.stream(
      { message: text, githubToken: token, conversationId: convId },
      (chunk) => {
        streamingContentRef.current += chunk;
        updateLastAssistantMessage(convId, streamingContentRef.current, true);
      },
      () => {
        updateLastAssistantMessage(convId, streamingContentRef.current, false);
        setIsStreaming(false);
      },
      (error) => {
        console.error('Stream error:', error);
        updateLastAssistantMessage(
          convId,
          streamingContentRef.current || '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
          false
        );
        setIsStreaming(false);
      }
    );
  };

  const handleNewChat = () => {
    setActiveConvId(null);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
    chatAPI.clearConversation(id).catch(() => {});
  };

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-950">
      <Sidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={handleNewChat}
        onDelete={handleDeleteConversation}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">DevPulse</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="h-full flex items-center justify-center p-6">
              <div className="max-w-lg w-full animate-fade-in">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-500/20">
                    <Bot size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    무엇을 도와드릴까요?
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    GitHub 레포지토리 분석, 팀 건강 진단, 코드 검사를 도와드립니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt.text)}
                      disabled={isStreaming}
                      className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-left hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all group disabled:opacity-50"
                    >
                      <prompt.icon size={18} className={`mt-0.5 flex-shrink-0 ${prompt.color}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {prompt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isStreaming} />
      </main>
    </div>
  );
}
