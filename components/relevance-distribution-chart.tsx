"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QueryEvaluation } from "@/lib/types"

interface RelevanceDistributionChartProps {
  evaluations: QueryEvaluation[]
}

export default function RelevanceDistributionChart({ evaluations }: RelevanceDistributionChartProps) {
  // Count relevance scores across all evaluations
  const scores = evaluations.flatMap((e) => e.metrics.detailedScores.map((s) => s.relevanceScore))

  const relevantCount = scores.filter((s) => s >= 2).length
  const partialCount = scores.filter((s) => s === 1).length
  const irrelevantCount = scores.filter((s) => s === 0).length

  const data = [
    { name: "Highly Relevant", value: relevantCount, color: "#10b981" },
    { name: "Partially Relevant", value: partialCount, color: "#f59e0b" },
    { name: "Not Relevant", value: irrelevantCount, color: "#ef4444" },
  ].filter((d) => d.value > 0)

  if (data.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Relevance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Relevance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
