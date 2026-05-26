export interface CategoryTrend {
  id: string;
  name: string;
  currentVolume: number;
  growthRate: number;
  stockCount: number;
}

export interface PredictionResult {
  predictedSales: number[];
  confidenceInterval: { min: number; max: number };
  optimizedPrice: number;
  inventoryAlertLevel: "SAFE" | "NORMAL" | "WARNING" | "CRITICAL" | string;
  demandElasticity: number;
  elasticityAnalysis: string;
}

export interface AutomationCopy {
  momoTitle: string;
  marketingBullets: string[];
  adBannerIdea: string;
  automationProcessLog: string;
}

export interface RecommendItem {
  name: string;
  price: number;
  pointsGift: number;
}

export interface AgentResponse {
  reply: string;
  recommends: RecommendItem[];
  realtimeAlert: string;
}

export interface OptimizedStep {
  step: string;
  desc: string;
}

export interface SystemDesignResult {
  diagnostics: string;
  optimizedWorkflow: OptimizedStep[];
  correctionLoop: {
    metricsToMonitor: string[];
    failureTriggers: string;
    feedbackAdjustments: string;
  };
}

export interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  recommends?: RecommendItem[];
}
