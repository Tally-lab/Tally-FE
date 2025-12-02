import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Loader2,
  Lock,
  BarChart3,
} from "lucide-react";
import { authAPI } from "../../services/api";
import { setUser } from "../../utils/auth";

const isDevelopment = true; // 개발 모드 강제 활성화
const ACCESS_CODE = "1024"; // 관리자 접근 코드

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [accessToken, setAccessToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      const authUrl = await authAPI.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError("GitHub 로그인 URL을 가져오는데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken.trim()) {
      setError("Access Token을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Mock 로그인 (백엔드 없이 테스트용)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser = {
        id: "mock-user-123",
        username: "TestUser",
        email: "test@example.com",
        avatarUrl: "",
        accessToken: accessToken,
      };

      setUser(mockUser);
      navigate("/dashboard");
    } catch (err) {
      setError("로그인에 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-dark relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <BarChart3 className="w-9 h-9 text-purple-600" />
            </div>
            <h1 className="text-6xl font-bold text-white tracking-tight">
              Tally
            </h1>
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">
            GitHub Analytics & Team Insights
          </h2>
          <p className="text-purple-200 text-xl leading-relaxed max-w-md">
            프로젝트 기여도를 정확하게 측정하고 팀의 성과를 한눈에 파악하세요.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Tally</h1>
            </div>
            <p className="text-gray-600">GitHub Analytics & Team Insights</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-600">Sign in to access your analytics</p>
            </div>

            {/* GitHub Login Button */}
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>

            {isDevelopment && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Development Mode
                    </span>
                  </div>
                </div>

                {!showTokenInput ? (
                  <button
                    onClick={() => setShowTokenInput(true)}
                    className="w-full text-gray-900 px-6 py-3 rounded-xl font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Developer Access</span>
                  </button>
                ) : !isUnlocked ? (
                  /* Access Code Screen */
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-600">Enter Access Code</p>
                    </div>
                    <input
                      type="password"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (accessCode === ACCESS_CODE) {
                            setIsUnlocked(true);
                            setError("");
                          } else {
                            setError("Invalid access code");
                          }
                        }
                      }}
                      placeholder="••••"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400"
                      maxLength={4}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTokenInput(false);
                          setAccessCode("");
                          setError("");
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (accessCode === ACCESS_CODE) {
                            setIsUnlocked(true);
                            setError("");
                          } else {
                            setError("Invalid access code");
                          }
                        }}
                        className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Token Input Form */
                  <form onSubmit={handleTokenLogin} className="space-y-4">
                    <div>
                      <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        GitHub Access Token
                      </label>
                      <input
                        id="token"
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="Enter any text for testing"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTokenInput(false);
                          setIsUnlocked(false);
                          setAccessCode("");
                          setAccessToken("");
                          setError("");
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !accessToken.trim()}
                        className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing in...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm pt-8">
              <p>© 2025 Tally Analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
