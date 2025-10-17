import axios from "axios";
import type {
  User,
  Repository,
  ContributionStats,
  Organization,
  OrganizationStats,
} from "../types";

// 백엔드 API 기본 URL
const API_BASE_URL = "http://localhost:8080";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // 30초 → 120초 (2분)
});

// 요청 인터셉터: 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
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
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

/**
 * 인증 관련 API
 */
export const authAPI = {
  getAuthUrl: async (): Promise<string> => {
    const response = await api.get<{ authUrl: string }>("/auth/github");
    return response.data.authUrl;
  },

  login: async (accessToken: string): Promise<User> => {
    const response = await api.post<User>("/auth/login", { accessToken });
    return response.data;
  },

  handleCallback: async (
    code: string
  ): Promise<{ user: User; accessToken: string }> => {
    const response = await api.get(`/auth/callback?code=${code}`);
    return response.data;
  },
};

/**
 * 레포지토리 관련 API
 */
export const repositoryAPI = {
  getUserRepositories: async (): Promise<Repository[]> => {
    const response = await api.get<Repository[]>("/repositories");
    return response.data;
  },

  getRepositoryCommits: async (owner: string, repo: string) => {
    const response = await api.get(`/repositories/${owner}/${repo}/commits`);
    return response.data;
  },
};

/**
 * 조직 관련 API
 */
export const organizationAPI = {
  getUserOrganizations: async (): Promise<Organization[]> => {
    const response = await api.get<Organization[]>("/organizations");
    return response.data;
  },

  getOrganizationStats: async (
    orgName: string,
    username?: string
  ): Promise<OrganizationStats> => {
    const params = username ? { username } : {};
    const response = await api.get<OrganizationStats>(
      `/organizations/${orgName}/stats`,
      { params }
    );
    return response.data;
  },

  getOrganizationRepositories: async (
    orgName: string
  ): Promise<Repository[]> => {
    const response = await api.get<Repository[]>(
      `/organizations/${orgName}/repositories`
    );
    return response.data;
  },
};

/**
 * 분석 관련 API
 */
export const analysisAPI = {
  // 기여도 분석
  analyzeContribution: async (
    owner: string,
    repo: string,
    username?: string
  ): Promise<ContributionStats> => {
    const params = username ? { username } : {};
    const response = await api.get<ContributionStats>(
      `/analysis/${owner}/${repo}`,
      { params }
    );
    return response.data;
  },

  // Markdown 리포트 다운로드
  downloadMarkdownReport: async (
    owner: string,
    repo: string,
    username?: string
  ): Promise<string> => {
    const params = username ? { username } : {};
    const response = await api.get(
      `/analysis/${owner}/${repo}/report/markdown`,
      {
        params,
        responseType: "text",
      }
    );
    return response.data;
  },

  // HTML 리포트 다운로드
  downloadHtmlReport: async (
    owner: string,
    repo: string,
    username?: string
  ): Promise<string> => {
    const params = username ? { username } : {};
    const response = await api.get(`/analysis/${owner}/${repo}/report/html`, {
      params,
      responseType: "text",
    });
    return response.data;
  },

  // 기존 downloadReport (호환성 유지)
  downloadReport: async (
    owner: string,
    repo: string,
    format: "markdown" | "html"
  ): Promise<Blob> => {
    const response = await api.get(
      `/analysis/${owner}/${repo}/report/${format}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export default api;
