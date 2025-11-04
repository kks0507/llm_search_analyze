"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TestResult, QueryType } from "@/lib/types"
import UploadForm from "./upload-form"
import ResultSummary from "./result-summary"
import MetricsVisualization from "./metrics-visualization"
import QueryComparison from "./query-comparison"
import ResultsHistory from "./results-history"
import QueryTypeFilter from "./query-type-filter"
import { Button } from "@/components/ui/button"
import PrecisionRecallChart from "./precision-recall-chart"
import RelevanceDistributionChart from "./relevance-distribution-chart"
import MetricsTrendChart from "./metrics-trend-chart"

export default function EvaluationDashboard() {
  const [results, setResults] = useState<TestResult[]>([])
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [selectedQueryType, setSelectedQueryType] = useState<QueryType | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("evaluationResults")
    if (stored) {
      try {
        setResults(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load stored results:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("evaluationResults", JSON.stringify(results))
  }, [results])

  const handleEvaluate = async (csvFile: File) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const csvContent = await csvFile.text()
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
      })

      if (!response.ok) {
        throw new Error("Evaluation failed")
      }

      const data: TestResult = await response.json()

      setResults((prev) => [data, ...prev])
      setCurrentResult(data)
      setSelectedQueryType(null)
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleExportResults = () => {
    if (!currentResult) return
    const dataStr = JSON.stringify(currentResult, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `evaluation_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteResult = (studentId: string) => {
    setResults((prev) => prev.filter((r) => r.studentId !== studentId))
    if (currentResult?.studentId === studentId) {
      setCurrentResult(null)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all results?")) {
      setResults([])
      setCurrentResult(null)
    }
  }

  const getFilteredEvaluations = () => {
    if (!currentResult) return []
    if (!selectedQueryType) return currentResult.evaluations

    return currentResult.evaluations.filter((e) => e.queryType === selectedQueryType)
  }

  const getFilteredMetrics = () => {
    const filtered = getFilteredEvaluations()
    if (filtered.length === 0) {
      return { avgPrecision: 0, avgRecall: 0, avgNdcg: 0 }
    }

    return {
      avgPrecision: filtered.reduce((sum, e) => sum + e.metrics.precision, 0) / filtered.length,
      avgRecall: filtered.reduce((sum, e) => sum + e.metrics.recall, 0) / filtered.length,
      avgNdcg: filtered.reduce((sum, e) => sum + e.metrics.ndcg, 0) / filtered.length,
    }
  }

  const getQueryTypeCounts = () => {
    if (!currentResult) return {}

    const counts: Record<string, number> = {}
    currentResult.evaluations.forEach((e) => {
      counts[e.queryType] = (counts[e.queryType] || 0) + 1
    })
    return counts
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">LLM Search Engine Evaluation</h1>
          <p className="text-slate-300">모니터링 질의 유형별 성능 분석 대시보드</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="bg-slate-700 mb-6">
            <TabsTrigger value="upload" className="text-white">
              Upload
            </TabsTrigger>
            <TabsTrigger value="results" className="text-white">
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white">
              History ({results.length})
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <UploadForm onEvaluate={handleEvaluate} loading={loading} error={error} success={success} />
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {currentResult ? (
              <>
                <ResultSummary result={currentResult} onExport={handleExportResults} />

                <QueryTypeFilter
                  selectedType={selectedQueryType}
                  onSelectType={setSelectedQueryType}
                  resultCounts={getQueryTypeCounts()}
                />

                <div className="grid grid-cols-3 gap-4">
                  <MetricsVisualization metrics={getFilteredMetrics()} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <PrecisionRecallChart evaluations={getFilteredEvaluations()} />
                  <RelevanceDistributionChart evaluations={getFilteredEvaluations()} />
                  <MetricsTrendChart evaluations={getFilteredEvaluations()} />
                </div>

                {/* Query Details */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    Query Details {selectedQueryType && `- ${selectedQueryType}`}
                  </h2>
                  {getFilteredEvaluations().length > 0 ? (
                    <Tabs defaultValue={`query-${getFilteredEvaluations()[0].queryId}`} className="w-full">
                      <TabsList className="bg-slate-700">
                        {getFilteredEvaluations().map((evaluation, idx) => (
                          <TabsTrigger key={idx} value={`query-${evaluation.queryId}`} className="text-white">
                            Query {evaluation.queryNumber}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {getFilteredEvaluations().map((evaluation, idx) => (
                        <TabsContent key={idx} value={`query-${evaluation.queryId}`}>
                          <QueryComparison evaluation={evaluation} />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="text-center py-8 bg-slate-800 rounded border border-slate-700">
                      <p className="text-slate-400">선택한 질의 유형의 결과가 없습니다. 다른 유형을 선택해주세요.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No results to display. Run an evaluation first.</p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleClearAll} variant="destructive" disabled={results.length === 0}>
                Clear All
              </Button>
            </div>
            <ResultsHistory results={results} onSelectResult={setCurrentResult} onDeleteResult={handleDeleteResult} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
