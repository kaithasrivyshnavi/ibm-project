export enum Classification {
  REAL = 'REAL',
  AI = 'AI',
  UNCERTAIN = 'UNCERTAIN'
}

export interface AnalysisMetrics {
  textureQuality: number; // 0-100 (100 being perfectly natural)
  lightingConsistency: number; // 0-100
  anatomicalCorrectness: number; // 0-100
  backgroundLogic: number; // 0-100
  noisePattern: number; // 0-100 (100 being natural ISO noise)
}

export interface AnalysisResult {
  classification: Classification;
  confidenceScore: number; // 0-100
  summary: string;
  detailedReasoning: string;
  metrics: AnalysisMetrics;
  detectedArtifacts: string[];
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  timestamp: number;
  result: AnalysisResult;
}