"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MetricsCardProps {
  label: string
  value: string | number
  unit?: string
  color: "blue" | "purple" | "cyan" | "emerald"
  trend?: "up" | "down" | "stable"
}

const colorMap = {
  blue: "from-blue-500 to-blue-600 text-blue-400",
  purple: "from-purple-500 to-purple-600 text-purple-400",
  cyan: "from-cyan-500 to-cyan-600 text-cyan-400",
  emerald: "from-emerald-500 to-emerald-600 text-emerald-400",
}

const trendMap = {
  up: "↑",
  down: "↓",
  stable: "→",
}

export default function MetricsCard({ label, value, unit, color, trend }: MetricsCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-r ${colorMap[color]} p-4 relative`}>
          <div className="absolute top-2 right-2 text-xl opacity-50">📊</div>
          <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">{value}</span>
              {unit && <span className="text-slate-200 text-sm">{unit}</span>}
            </div>
            {trend && <span className="text-lg">{trendMap[trend]}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
