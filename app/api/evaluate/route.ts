import { type NextRequest, NextResponse } from "next/server"
import { parseCSV } from "@/lib/csv-parser"
import { evaluateWithGemini } from "@/lib/gemini-evaluator"
import { fetchAISearchResults } from "@/lib/ai-search-client"
import type { QueryEvaluation, TestResult } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { csvContent } = await request.json()

    if (!csvContent) {
      return NextResponse.json({ error: "CSV content required" }, { status: 400 })
    }

    const entries = parseCSV(csvContent)

    if (entries.length === 0) {
      return NextResponse.json({ error: "No valid entries in CSV" }, { status: 400 })
    }

    const allEvaluations: QueryEvaluation[] = []

    for (const entry of entries) {
      console.log(`[Evaluate API] Processing entry: ${entry.name}`)

      const queries = [
        {
          id: "1",
          query: entry.query1,
          groundTruth: entry.books1,
          queryType: entry.queryType1,
          queryNumber: 1,
        },
        {
          id: "2",
          query: entry.query2,
          groundTruth: entry.books2,
          queryType: entry.queryType2,
          queryNumber: 2,
        },
        {
          id: "3",
          query: entry.query3,
          groundTruth: entry.books3,
          queryType: entry.queryType3,
          queryNumber: 3,
        },
      ]

      for (const q of queries) {
        if (!q.query) {
          console.log(`[Evaluate API] Skipping empty query ${q.id}`)
          continue
        }

        try {
          // Fetch AI results
          const aiResults = await fetchAISearchResults(q.query)

          // Evaluate with Gemini
          const metrics = await evaluateWithGemini(q.groundTruth, aiResults, q.query)

          allEvaluations.push({
            queryId: q.id,
            queryNumber: q.queryNumber,
            query: q.query,
            queryType: q.queryType,
            groundTruth: q.groundTruth,
            aiResults,
            metrics,
          })

          console.log(`[Evaluate API] Query ${q.id} evaluated - Precision: ${metrics.precision.toFixed(2)}`)
        } catch (queryError) {
          console.error(`[Evaluate API] Error evaluating query ${q.id}:`, queryError)
          // Continue with next query on error
        }
      }
    }

    if (allEvaluations.length === 0) {
      return NextResponse.json({ error: "No queries could be evaluated" }, { status: 400 })
    }

    // Calculate averages
    const avgPrecision = allEvaluations.reduce((sum, e) => sum + e.metrics.precision, 0) / allEvaluations.length
    const avgRecall = allEvaluations.reduce((sum, e) => sum + e.metrics.recall, 0) / allEvaluations.length
    const avgNdcg = allEvaluations.reduce((sum, e) => sum + e.metrics.ndcg, 0) / allEvaluations.length

    const result: TestResult = {
      studentId: "batch_" + Date.now(),
      studentName: "Batch Evaluation",
      timestamp: new Date().toISOString(),
      evaluations: allEvaluations,
      averageMetrics: {
        avgPrecision,
        avgRecall,
        avgNdcg,
      },
    }

    console.log(`[Evaluate API] Batch evaluation complete with ${allEvaluations.length} queries`)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Evaluation error:", error)
    return NextResponse.json({ error: "Evaluation failed", details: String(error) }, { status: 500 })
  }
}
