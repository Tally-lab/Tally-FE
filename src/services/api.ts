import axios from 'axios';
import type { User, Repository, ContributionStats } from '../types';

// 백엔드 API 기본 URL
const API_BASE_URL = 'http://localhost:8080';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그아웃 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * 인증 관련 API
 */
export const authAPI = {
  /**
   * GitHub OAuth 인증 URL 가져오기
   */
  getAuthUrl: async (): Promise<string> => {
    const response = await api.get<{ authUrl: string }>('/auth/github');
    return response.data.authUrl;
  },

  /**
   * Access Token으로 로그인
   */
  login: async (accessToken: string): Promise<User> => {
    const response = await api.post<User>('/auth/login', { accessToken });
    return response.data;
  },

  /**
   * OAuth Callback 처리 (필요시 사용)
   */
  handleCallback: async (code: string): Promise<User> => {
    const response = await api.get<{ user: User }>(`/auth/callback?code=${code}`);
    return response.data.user;
  },
};

/**
 * 레포지토리 관련 API
 */
export const repositoryAPI = {
  /**
   * 사용자의 GitHub 레포지토리 목록 조회
   */
  getUserRepositories: async (): Promise<Repository[]> => {
    const response = await api.get<Repository[]>('/repositories');
    return response.data;
  },

  /**
   * 특정 레포지토리의 커밋 목록 조회
   */
  getRepositoryCommits: async (owner: string, repo: string) => {
    const response = await api.get(`/repositories/${owner}/${repo}/commits`);
    return response.data;
  },
};

/**
 * 분석 관련 API
 */
export const analysisAPI = {
  /**
   * 기여도 분석 실행
   */
  analyzeContribution: async (
    owner: string,
    repo: string,
    username: string
  ): Promise<ContributionStats> => {
    const response = await api.post<ContributionStats>('/analysis/analyze', {
      owner,
      repo,
      username,
    });
    return response.data;
  },
};

/**
 * 리포트 관련 API
 */
export const reportAPI = {
  /**
   * Markdown 리포트 다운로드
   */
  downloadMarkdown: async (owner: string, repo: string, username: string): Promise<string> => {
    const response = await api.post<string>(
      '/reports/markdown',
      { owner, repo, username },
      { responseType: 'text' }
    );
    return response.data;
  },

  /**
   * HTML 리포트 다운로드
   */
  downloadHtml: async (owner: string, repo: string, username: string): Promise<string> => {
    const response = await api.post<string>(
      '/reports/html',
      { owner, repo, username },
      { responseType: 'text' }
    );
    return response.data;
  },
};

/**
 * 헬스 체크 (백엔드 연결 확인용)
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/actuator/health');
    return true;
  } catch {
    return false;
  }
};

export default api;
