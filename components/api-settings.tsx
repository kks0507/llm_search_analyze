"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Settings } from "lucide-react"
import { useState, useEffect } from "react"

interface ApiStatusProps {
  hasApiKey: boolean
  model: string
  onRefresh?: () => void
}

export default function ApiSettings({ hasApiKey, model, onRefresh }: ApiStatusProps) {
  const [cacheStats, setCacheStats] = useState<{ size: number } | null>(null)

  useEffect(() => {
    // This would be called from a server action in a real implementation
    setCacheStats({ size: 0 })
  }, [])

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Status */}
        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center gap-2">
            {hasApiKey ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className="text-sm font-medium text-white">API Key</p>
              <p className="text-xs text-slate-400">{hasApiKey ? "Configured" : "Not configured"}</p>
            </div>
          </div>
          <Badge
            variant={hasApiKey ? "default" : "destructive"}
            className={hasApiKey ? "bg-emerald-600" : "bg-red-600"}
          >
            {hasApiKey ? "Ready" : "Missing"}
          </Badge>
        </div>

        {/* Model Info */}
        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div>
            <p className="text-sm font-medium text-white">Model</p>
            <p className="text-xs text-slate-400">{model}</p>
          </div>
          <Badge variant="outline" className="text-slate-300">
            Active
          </Badge>
        </div>

        {/* Cache Info */}
        {cacheStats && (
          <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
            <div>
              <p className="text-sm font-medium text-white">Cache</p>
              <p className="text-xs text-slate-400">{cacheStats.size} evaluations cached</p>
            </div>
            {cacheStats.size > 0 && (
              <Button size="sm" variant="outline" onClick={onRefresh} className="text-xs bg-transparent">
                Clear
              </Button>
            )}
          </div>
        )}

        {!hasApiKey && (
          <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
            <p className="text-xs text-red-200">
              Warning: GEMINI_API_KEY environment variable is not set. Evaluations will use default metrics.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
