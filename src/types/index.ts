export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatRequest {
  message: string;
  githubToken: string;
  conversationId: string;
  selectedOrg?: string;
}

export interface ChatResponse {
  response: string;
  conversationId: string;
}

export interface ProjectOverview {
  repo: {
    fullName: string;
    description: string;
    defaultBranch: string;
    stars: number;
    forks: number;
    openIssues: number;
  };
  contributors: {
    login: string;
    avatarUrl: string;
    commits: number;
    percentage: number;
  }[];
  health: {
    busFactor: { score: number; status: string };
    review: {
      openPRs: number;
      pendingPRs: { number: number; title: string; author: string; createdAt: string }[];
    };
  };
  recentActivity: {
    commits7d: number;
    prsOpened7d: number;
    prsMerged7d: number;
  };
  languages: Record<string, number>;
  techStack: {
    totalCount: number;
    categories: {
      category: string;
      items: { name: string; version: string; docsUrl: string; source: string }[];
    }[];
  };
}

export interface ReportData {
  reportId: string;
  owner: string;
  repo: string;
  generatedAt: string;
  analysisPeriodDays: number;
  dora: unknown;
  busFactor: unknown;
  burnout: unknown;
  commitQuality: unknown;
  reviewBottleneck: unknown;
  roleDistribution: unknown;
  techStack: unknown;
  recentActivity: unknown;
  aiDiagnosis: {
    doraInterpretation: string;
    busFactorInterpretation: string;
    burnoutInterpretation: string;
    commitQualityInterpretation: string;
    reviewBottleneckInterpretation: string;
    immediateActions: ActionItem[];
    improvements: ActionItem[];
    strengths: ActionItem[];
  };
}

export interface ActionItem {
  icon: string;
  title: string;
  description: string;
}
