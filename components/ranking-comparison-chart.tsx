"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QueryEvaluation } from "@/lib/types"

interface RankingComparisonChartProps {
  evaluation: QueryEvaluation
}

export default function RankingComparisonChart({ evaluation }: RankingComparisonChartProps) {
  const data = evaluation.metrics.detailedScores
    .filter((s) => s.aiResultRank !== null)
    .map((s) => ({
      groundTruthRank: s.groundTruthRank,
      aiResultRank: s.aiResultRank || 0,
      relevance: s.relevanceScore,
      title: s.title.substring(0, 20),
    }))

  if (data.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Ground Truth vs AI Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">No matching results to compare</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Ground Truth vs AI Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              type="number"
              dataKey="groundTruthRank"
              name="Ground Truth Rank"
              stroke="#94a3b8"
              label={{ value: "Ground Truth Rank", position: "right", offset: 10 }}
            />
            <YAxis
              type="number"
              dataKey="aiResultRank"
              name="AI Result Rank"
              stroke="#94a3b8"
              label={{ value: "AI Result Rank", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              labelStyle={{ color: "#f1f5f9" }}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter name="Matches" data={data} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
