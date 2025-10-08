export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  accessToken: string;
}

// localStorage 키
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

/**
 * Access Token 저장
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Access Token 제거
 */
export const removeAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 사용자 정보 저장
 */
export const setUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAccessToken(user.accessToken);
};

/**
 * 사용자 정보 가져오기
 */
export const getUser = (): AuthUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * 사용자 정보 제거
 */
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
  removeAccessToken();
};

/**
 * 로그인 여부 확인
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * 로그아웃
 */
export const logout = (): void => {
  removeUser();
  removeAccessToken();
};
