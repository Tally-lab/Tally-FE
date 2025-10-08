/**
 * 사용자 정보
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  accessToken: string;
}

/**
 * GitHub 레포지토리 정보
 */
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  url: string;
  owner: string;
  isPrivate?: boolean;
  defaultBranch?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 기여도 통계
 */
export interface ContributionStats {
  id: string;
  userId: string;
  repositoryFullName: string;
  totalCommits: number;
  userCommits: number;
  commitPercentage: number;
  additions?: number;
  deletions?: number;
  languageDistribution?: Record<string, number>;
  hourlyActivity?: Record<number, number>;
  dailyActivity?: Record<string, number>;
  roleDistribution?: Record<string, RoleStats>;
  analyzedAt: string;
}

/**
 * 역할별 통계
 */
export interface RoleStats {
  roleName: string;
  commitCount: number;
  percentage: number;
}

/**
 * Pull Request 정보
 */
export interface PullRequest {
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  closedAt?: string;
  mergedAt?: string;
  user?: User;
  body?: string;
}

/**
 * Issue 정보
 */
export interface Issue {
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  closedAt?: string;
  user?: User;
  body?: string;
}

/**
 * 커밋 정보
 */
export interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: User;
  committer?: User;
  files?: CommitFile[];
}

/**
 * 커밋 파일 정보
 */
export interface CommitFile {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  changes: number;
  blobUrl?: string;
}

/**
 * 리포트 정보
 */
export interface Report {
  id: string;
  userId: string;
  contributionStatsId: string;
  format: ReportFormat;
  content: string;
  generatedAt: string;
}

/**
 * 리포트 포맷 (enum 대신 union type 사용)
 */
export type ReportFormat = 'MARKDOWN' | 'HTML' | 'PNG';

/**
 * API 에러 응답
 */
export interface ApiError {
  message: string;
  status?: number;
  error?: string;
}

/**
 * API 성공 응답 (공통)
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
