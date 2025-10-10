import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { setUser } from "../../utils/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");
    const avatarUrl = searchParams.get("avatarUrl");
    const error = searchParams.get("error");

    if (error) {
      // 에러가 있으면 로그인 페이지로
      navigate("/?error=" + error);
      return;
    }

    if (accessToken && userId && username) {
      // 사용자 정보 저장
      const user = {
        id: userId,
        username: username,
        email: "",
        avatarUrl: avatarUrl || "",
        accessToken: accessToken,
      };

      setUser(user);

      // 대시보드로 이동
      navigate("/dashboard");
    } else {
      // 필요한 정보가 없으면 로그인 페이지로
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">로그인 처리 중...</p>
      </div>
    </div>
  );
}
