import { GoogleGenerativeAI } from "@google/generative-ai"
import type { SurveyBook, AISearchResult, EvaluationMetrics } from "./types"
import { validateGeminiConfig } from "./gemini-config"

// Simple in-memory cache for evaluation results
const evaluationCache = new Map<string, EvaluationMetrics>()

function getCacheKey(query: string, groundTruthIds: string, aiResultIds: string): string {
  return `${query}|${groundTruthIds}|${aiResultIds}`
}

function calculateNDCG(relevanceScores: number[]): number {
  if (relevanceScores.length === 0) return 0

  // Calculate DCG
  let dcg = 0
  for (let i = 0; i < relevanceScores.length; i++) {
    dcg += relevanceScores[i] / Math.log2(i + 2)
  }

  // Calculate IDCG (ideal DCG with sorted scores)
  const sortedScores = [...relevanceScores].sort((a, b) => b - a)
  let idcg = 0
  for (let i = 0; i < sortedScores.length; i++) {
    idcg += sortedScores[i] / Math.log2(i + 2)
  }

  return idcg > 0 ? dcg / idcg : 0
}

export async function evaluateWithGemini(
  groundTruth: SurveyBook[],
  aiResults: AISearchResult[],
  query: string,
): Promise<EvaluationMetrics> {
  try {
    const config = validateGeminiConfig()

    const groundTruthIds = groundTruth.map((b) => b.title).join("|")
    const aiResultIds = aiResults.map((r) => r.work_title).join("|")
    const cacheKey = getCacheKey(query, groundTruthIds, aiResultIds)

    if (evaluationCache.has(cacheKey)) {
      console.log("[Gemini] Using cached evaluation result")
      return evaluationCache.get(cacheKey)!
    }

    const genAI = new GoogleGenerativeAI(config.apiKey)
    const model = genAI.getGenerativeModel({ model: config.model })

    const prompt = `You are an academic book search evaluation expert. Evaluate the relevance of AI search results against ground truth recommendations.

Query: "${query}"

Ground Truth Books (정답 도서):
${groundTruth.map((b, i) => `${i + 1}. "${b.title}" by ${b.author} (${b.year})`).join("\n")}

AI Search Results:
${aiResults
  .slice(0, 10)
  .map((r, i) => `${i + 1}. "${r.work_title}" by ${r.work_author}`)
  .join("\n")}

Task: For each AI result, assign a relevance score (0-3) based on how well it matches the ground truth:
- 0: Not relevant
- 1: Partially relevant (different topic but could be useful)
- 2: Highly relevant (similar topic/theme)
- 3: Exact/perfect match

Respond in JSON format:
{
  "scores": [
    {"aiResultIndex": 0, "relevanceScore": 2, "reasoning": "Similar theme..."},
    ...
  ]
}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs)

    try {
      const result = await model.generateContent(prompt)
      clearTimeout(timeoutId)

      const responseText = result.response.text()

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return getDefaultMetrics(groundTruth, aiResults)
      }

      const parsed = JSON.parse(jsonMatch[0])
      const scores = parsed.scores || []

      // Calculate metrics
      const relevanceScores = scores.map((s: any) => s.relevanceScore || 0)

      const precision = calculatePrecision(scores, groundTruth.length)
      const recall = calculateRecall(scores, groundTruth.length)
      const ndcg = calculateNDCG(relevanceScores)
      const mrr = calculateMRR(relevanceScores)

      const detailedScores = groundTruth.map((book, idx) => {
        const aiMatch = aiResults.findIndex(
          (r) =>
            r.work_title.toLowerCase().includes(book.title.toLowerCase()) ||
            book.title.toLowerCase().includes(r.work_title.toLowerCase()),
        )

        return {
          title: book.title,
          author: book.author,
          groundTruthRank: idx + 1,
          aiResultRank: aiMatch >= 0 ? aiMatch + 1 : null,
          relevanceScore: relevanceScores[aiMatch] || 0,
        }
      })

      const metrics: EvaluationMetrics = {
        precision,
        recall,
        ndcg,
        meanReciprocalRank: mrr,
        detailedScores,
      }

      evaluationCache.set(cacheKey, metrics)

      return metrics
    } catch (timeoutError) {
      clearTimeout(timeoutId)
      console.error("Gemini API timeout or error:", timeoutError)
      return getDefaultMetrics(groundTruth, aiResults)
    }
  } catch (error) {
    console.error("Gemini evaluation error:", error)
    return getDefaultMetrics(groundTruth, aiResults)
  }
}

function calculatePrecision(scores: any[], groundTruthCount: number): number {
  const relevant = scores.filter((s: any) => s.relevanceScore >= 2).length
  return scores.length > 0 ? relevant / scores.length : 0
}

function calculateRecall(scores: any[], groundTruthCount: number): number {
  const relevant = scores.filter((s: any) => s.relevanceScore >= 2).length
  return groundTruthCount > 0 ? relevant / groundTruthCount : 0
}

function calculateMRR(relevanceScores: number[]): number {
  for (let i = 0; i < relevanceScores.length; i++) {
    if (relevanceScores[i] >= 2) {
      return 1 / (i + 1)
    }
  }
  return 0
}

function getDefaultMetrics(groundTruth: SurveyBook[], aiResults: AISearchResult[]): EvaluationMetrics {
  return {
    precision: 0,
    recall: 0,
    ndcg: 0,
    meanReciprocalRank: 0,
    detailedScores: groundTruth.map((book, idx) => ({
      title: book.title,
      author: book.author,
      groundTruthRank: idx + 1,
      aiResultRank: null,
      relevanceScore: 0,
    })),
  }
}

export function clearEvaluationCache(): void {
  evaluationCache.clear()
  console.log("[Gemini] Evaluation cache cleared")
}

export function getEvaluationCacheStats(): { size: number; keys: string[] } {
  return {
    size: evaluationCache.size,
    keys: Array.from(evaluationCache.keys()),
  }
}
