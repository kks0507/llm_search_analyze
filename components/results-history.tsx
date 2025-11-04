"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TestResult } from "@/lib/types"
import { Trash2, Eye } from "lucide-react"

interface ResultsHistoryProps {
  results: TestResult[]
  onSelectResult: (result: TestResult) => void
  onDeleteResult: (studentId: string) => void
}

export default function ResultsHistory({ results, onSelectResult, onDeleteResult }: ResultsHistoryProps) {
  if (results.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-slate-400 text-center py-8">No evaluation history yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Evaluation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.studentId}
              className="bg-slate-700 rounded-lg p-4 hover:bg-slate-650 transition border border-slate-600 hover:border-slate-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{result.studentName}</h3>
                    <Badge variant="outline" className="text-xs">
                      {result.studentId}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(result.timestamp).toLocaleString()}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-slate-300">
                      Precision:{" "}
                      <span className="font-semibold text-blue-400">
                        {(result.averageMetrics.avgPrecision * 100).toFixed(1)}%
                      </span>
                    </span>
                    <span className="text-slate-300">
                      Recall:{" "}
                      <span className="font-semibold text-purple-400">
                        {(result.averageMetrics.avgRecall * 100).toFixed(1)}%
                      </span>
                    </span>
                    <span className="text-slate-300">
                      nDCG:{" "}
                      <span className="font-semibold text-cyan-400">
                        {(result.averageMetrics.avgNdcg * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onSelectResult(result)} className="gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteResult(result.studentId)}
                    className="text-red-400 hover:text-red-300 gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
