import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Loader2,
  KeyRound,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";
import { authAPI } from "../../services/api";
import { setUser } from "../../utils/auth";

const isDevelopment = true; // 개발 모드 강제 활성화

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [accessToken, setAccessToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: BarChart3, color: "text-primary-500" },
    { Icon: TrendingUp, color: "text-secondary-500" },
    { Icon: Activity, color: "text-primary-600" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const CurrentIconComponent = icons[currentIcon].Icon;
  const currentColor = icons[currentIcon].color;

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-6 relative">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent relative z-10">
                Tally
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-500">
              <CurrentIconComponent
                className={`w-5 h-5 ${currentColor} animate-bounce`}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 animate-fade-in">
            Tally Analytics
          </h1>
          <p className="text-white/90 text-lg animate-fade-in-delay">
            GitHub 프로젝트 기여도를 증명하세요
          </p>
        </div>

        <div className="card bg-white hover:shadow-2xl transition-shadow duration-300">
          <div className="space-y-4">
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>연결 중...</span>
                </>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  <span>GitHub으로 로그인</span>
                </>
              )}
            </button>

            {isDevelopment && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      또는 (개발 모드)
                    </span>
                  </div>
                </div>

                {!showTokenInput ? (
                  <button
                    onClick={() => setShowTokenInput(true)}
                    className="w-full text-primary-600 px-6 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>Access Token으로 로그인</span>
                  </button>
                ) : (
                  <form onSubmit={handleTokenLogin} className="space-y-3">
                    <div>
                      <label
                        htmlFor="token"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        GitHub Personal Access Token (테스트용 - 아무거나 입력)
                      </label>
                      <input
                        id="token"
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="test123 (아무 텍스트)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTokenInput(false);
                          setAccessToken("");
                          setError("");
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !accessToken.trim()}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            로그인 중...
                          </span>
                        ) : (
                          "로그인"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-in">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-white/80 text-sm">
          <p>2025 Tally Analytics. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
