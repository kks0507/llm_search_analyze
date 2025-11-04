import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QueryEvaluation } from "@/lib/types"
import RankingComparisonChart from "./ranking-comparison-chart"

interface QueryComparisonProps {
  evaluation: QueryEvaluation
}

export default function QueryComparison({ evaluation }: QueryComparisonProps) {
  return (
    <div className="space-y-4">
      {/* Query */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Query</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 italic">{evaluation.query}</p>
        </CardContent>
      </Card>

      {/* Ranking Comparison Chart */}
      <RankingComparisonChart evaluation={evaluation} />

      {/* Metrics Summary */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <p className="text-slate-400 text-xs">Precision</p>
            <p className="text-2xl font-bold text-blue-400">{(evaluation.metrics.precision * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <p className="text-slate-400 text-xs">Recall</p>
            <p className="text-2xl font-bold text-purple-400">{(evaluation.metrics.recall * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <p className="text-slate-400 text-xs">nDCG</p>
            <p className="text-2xl font-bold text-cyan-400">{(evaluation.metrics.ndcg * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <p className="text-slate-400 text-xs">MRR</p>
            <p className="text-2xl font-bold text-emerald-400">{evaluation.metrics.meanReciprocalRank.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scoring */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Ground Truth vs AI Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {evaluation.metrics.detailedScores.map((score, idx) => (
              <div
                key={idx}
                className="bg-slate-700 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium">{score.title}</p>
                    <p className="text-slate-400 text-sm">{score.author}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        score.relevanceScore >= 2 ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                      }`}
                    >
                      Score: {score.relevanceScore}/3
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span>
                    GT Rank: <span className="text-slate-200 font-semibold">{score.groundTruthRank}</span>
                  </span>
                  <span>
                    AI Rank: <span className="text-slate-200 font-semibold">{score.aiResultRank || "N/A"}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Results */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">AI Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evaluation.aiResults.slice(0, 5).map((result, idx) => (
              <div key={idx} className="bg-slate-700 rounded p-2 text-sm">
                <p className="text-white font-medium">{result.work_title}</p>
                <p className="text-slate-400">{result.work_author}</p>
                <p className="text-xs text-slate-500 mt-1">Similarity: {(result.similarity * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
