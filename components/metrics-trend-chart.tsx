"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QueryEvaluation } from "@/lib/types"

interface MetricsTrendChartProps {
  evaluations: QueryEvaluation[]
}

export default function MetricsTrendChart({ evaluations }: MetricsTrendChartProps) {
  const data = evaluations.map((evaluation, idx) => ({
    query: `Q${idx + 1}`,
    precision: Math.round(evaluation.metrics.precision * 1000) / 10,
    recall: Math.round(evaluation.metrics.recall * 1000) / 10,
    ndcg: Math.round(evaluation.metrics.ndcg * 1000) / 10,
    mrr: Math.round(evaluation.metrics.meanReciprocalRank * 1000) / 10,
  }))

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Metrics Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="query" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Line type="monotone" dataKey="precision" stroke="#3b82f6" name="Precision (%)" connectNulls />
            <Line type="monotone" dataKey="recall" stroke="#a855f7" name="Recall (%)" connectNulls />
            <Line type="monotone" dataKey="ndcg" stroke="#06b6d4" name="nDCG (%)" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
