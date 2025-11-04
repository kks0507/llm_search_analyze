"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TestResult } from "@/lib/types"
import { Download } from "lucide-react"

interface ResultSummaryProps {
  result: TestResult
  onExport?: () => void
}

export default function ResultSummary({ result, onExport }: ResultSummaryProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  const getPerformanceLevel = (value: number) => {
    if (value >= 0.8) return { label: "Excellent", color: "bg-emerald-100 text-emerald-800" }
    if (value >= 0.6) return { label: "Good", color: "bg-blue-100 text-blue-800" }
    if (value >= 0.4) return { label: "Fair", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Poor", color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="space-y-4">
      {/* Header with student info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">{result.studentName}</CardTitle>
              <p className="text-slate-400 text-sm mt-1">ID: {result.studentId}</p>
            </div>
            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 text-sm">Evaluated: {formatDate(result.timestamp)}</p>
        </CardContent>
      </Card>

      {/* Overall performance */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Average Precision</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-blue-400">
                  {(result.averageMetrics.avgPrecision * 100).toFixed(0)}
                </span>
                <span className="text-slate-400">%</span>
              </div>
              <Badge className={`mt-2 ${getPerformanceLevel(result.averageMetrics.avgPrecision).color}`}>
                {getPerformanceLevel(result.averageMetrics.avgPrecision).label}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Average Recall</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-purple-400">
                  {(result.averageMetrics.avgRecall * 100).toFixed(0)}
                </span>
                <span className="text-slate-400">%</span>
              </div>
              <Badge className={`mt-2 ${getPerformanceLevel(result.averageMetrics.avgRecall).color}`}>
                {getPerformanceLevel(result.averageMetrics.avgRecall).label}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Average nDCG</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold text-cyan-400">
                  {(result.averageMetrics.avgNdcg * 100).toFixed(0)}
                </span>
                <span className="text-slate-400">%</span>
              </div>
              <Badge className={`mt-2 ${getPerformanceLevel(result.averageMetrics.avgNdcg).color}`}>
                {getPerformanceLevel(result.averageMetrics.avgNdcg).label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evaluation statistics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Queries Evaluated</p>
              <p className="text-2xl font-semibold text-white mt-1">{result.evaluations.length}</p>
            </div>
            <div>
              <p className="text-slate-400">Timestamp</p>
              <p className="text-xs text-slate-300 mt-1">{new Date(result.timestamp).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <p className="text-lg font-semibold text-emerald-400 mt-1">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
