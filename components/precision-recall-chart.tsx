"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QueryEvaluation } from "@/lib/types"

interface PrecisionRecallChartProps {
  evaluations: QueryEvaluation[]
}

export default function PrecisionRecallChart({ evaluations }: PrecisionRecallChartProps) {
  const data = evaluations.map((evaluation, idx) => ({
    name: `Query ${idx + 1}`,
    precision: Math.round(evaluation.metrics.precision * 100),
    recall: Math.round(evaluation.metrics.recall * 100),
    ndcg: Math.round(evaluation.metrics.ndcg * 100),
  }))

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Metrics by Query</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Bar dataKey="precision" fill="#3b82f6" name="Precision (%)" />
            <Bar dataKey="recall" fill="#a855f7" name="Recall (%)" />
            <Bar dataKey="ndcg" fill="#06b6d4" name="nDCG (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
