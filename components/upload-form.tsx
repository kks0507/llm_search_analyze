"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QueryType } from "@/lib/types"
import { QUERY_TYPES } from "@/lib/types"

interface UploadFormProps {
  onEvaluate: (csvFile: File, queryTypes?: QueryType[]) => Promise<void>
  loading: boolean
  error?: string
  success?: boolean
}

export default function UploadForm({ onEvaluate, loading, error, success }: UploadFormProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [selectedQueryTypes, setSelectedQueryTypes] = useState<QueryType[]>(QUERY_TYPES)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0])
    }
  }

  const handleQueryTypeChange = (value: string) => {
    if (value === "all") {
      setSelectedQueryTypes(QUERY_TYPES)
    } else {
      setSelectedQueryTypes([value as QueryType])
    }
  }

  const handleSubmit = async () => {
    if (!csvFile) {
      return
    }
    await onEvaluate(csvFile, selectedQueryTypes)
  }

  const isReady = csvFile

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Survey Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">CSV File</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0"
            disabled={loading}
          />
          {csvFile && <p className="text-xs text-slate-400 mt-1">✓ Selected: {csvFile.name}</p>}
        </div>

        {csvFile && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Query Type to Evaluate</label>
            <Select defaultValue="all" onValueChange={handleQueryTypeChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">모두 평가하기</SelectItem>
                {QUERY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-900 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-200" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="bg-emerald-900 border-emerald-700">
            <CheckCircle className="h-4 w-4 text-emerald-200" />
            <AlertDescription className="text-emerald-200">Evaluation completed successfully!</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isReady || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Evaluating Queries...
            </>
          ) : (
            "Run Evaluation"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
