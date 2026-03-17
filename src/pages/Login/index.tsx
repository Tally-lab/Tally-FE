import { useState } from 'react';
import { Github, Loader2, Bot, Sun, Moon, ArrowRight, Sparkles, Shield, MessageSquare } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Login({ darkMode, onToggleDark }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/auth/github`);
      if (!response.ok) throw new Error('서버에 연결할 수 없습니다.');

      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (err) {
      setError('GitHub 로그인을 시작할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: '대화형 분석',
      desc: '자연어로 레포지토리와 팀을 분석합니다',
    },
    {
      icon: Shield,
      title: '팀 건강 진단',
      desc: '코드 의존도, 개발 속도, 야근/과로 위험을 감지합니다',
    },
    {
      icon: Sparkles,
      title: '코드 검사',
      desc: '팀 맥락 기반으로 PR을 검사하고 개선점을 제안합니다',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-950">
      {/* Left — Feature Showcase */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-gray-900 to-brand-950" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">DevPulse</h1>
              <p className="text-xs text-brand-300/80 font-medium tracking-wide">by Tally</p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            팀의 맥박을 읽는
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
              AI 코치
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-md mb-12 leading-relaxed">
            물어보면 팀의 맥박을 읽고, 코드를 검사하고, 행동을 제안합니다.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">DevPulse</h1>
              <p className="text-2xs text-gray-400">Engineering Intelligence</p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">시작하기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              GitHub 계정으로 로그인하여 팀 분석을 시작하세요.
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Github size={20} />
                GitHub로 로그인
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">안내</h3>
            <ul className="text-2xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>• GitHub OAuth를 통해 안전하게 로그인합니다</li>
              <li>• 레포지토리 읽기 권한(repo, read:org)을 사용합니다</li>
              <li>• 토큰은 로컬에만 저장되며 서버에 저장하지 않습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
