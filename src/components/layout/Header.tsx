import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Tally Analytics
              </h1>
              <p className="text-xs text-gray-500">GitHub 기여도 분석</p>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
