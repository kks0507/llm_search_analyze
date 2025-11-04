export interface SurveyBook {
  title: string
  author: string
  publisher: string
  year: string
}

export interface SurveyEntry {
  timestamp: string
  name: string
  studentId: string
  query1: string
  books1: SurveyBook[]
  queryType1: string
  query2: string
  books2: SurveyBook[]
  queryType2: string
  query3: string
  books3: SurveyBook[]
  queryType3: string
}

export interface AISearchResult {
  work_id: number
  work_title: string
  work_author: string
  similarity: number
  book_id?: number
  book_title?: string
  book_author?: string
}

export interface EvaluationMetrics {
  precision: number
  recall: number
  ndcg: number
  meanReciprocalRank: number
  detailedScores: Array<{
    title: string
    author: string
    groundTruthRank: number
    aiResultRank: number | null
    relevanceScore: number
  }>
}

export interface QueryEvaluation {
  queryId: string
  queryNumber: number
  query: string
  queryType: string
  groundTruth: SurveyBook[]
  aiResults: AISearchResult[]
  metrics: EvaluationMetrics
}

export interface TestResult {
  studentId: string
  studentName: string
  timestamp: string
  evaluations: QueryEvaluation[]
  averageMetrics: {
    avgPrecision: number
    avgRecall: number
    avgNdcg: number
  }
}

export type QueryType =
  | "🧑‍🔬 과제/연구 수행형"
  | "📚 전공/심화 학습형"
  | "🌍 사회/문화/과학 주제 탐구형"
  | "🎨 문학/콘텐츠 추천형"
  | "🧘 개인적 성장/문제 해결형"

export const QUERY_TYPES: QueryType[] = [
  "🧑‍🔬 과제/연구 수행형",
  "📚 전공/심화 학습형",
  "🌍 사회/문화/과학 주제 탐구형",
  "🎨 문학/콘텐츠 추천형",
  "🧘 개인적 성장/문제 해결형",
]
