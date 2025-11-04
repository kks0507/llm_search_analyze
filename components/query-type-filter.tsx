"use client"

import { QUERY_TYPES, type QueryType } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface QueryTypeFilterProps {
  selectedType: QueryType | null
  onSelectType: (type: QueryType | null) => void
  resultCounts?: Record<string, number>
}

export default function QueryTypeFilter({ selectedType, onSelectType, resultCounts = {} }: QueryTypeFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Query Type Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Button
          onClick={() => onSelectType(null)}
          variant={selectedType === null ? "default" : "outline"}
          className={`text-left justify-start ${
            selectedType === null ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-slate-600"
          }`}
        >
          All Types{" "}
          {resultCounts &&
            Object.values(resultCounts).reduce((a, b) => a + b, 0) > 0 &&
            `(${Object.values(resultCounts).reduce((a, b) => a + b, 0)})`}
        </Button>
        {QUERY_TYPES.map((type) => (
          <Button
            key={type}
            onClick={() => onSelectType(type)}
            variant={selectedType === type ? "default" : "outline"}
            className={`text-left justify-start ${
              selectedType === type ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-slate-600"
            }`}
          >
            {type} {resultCounts[type] && `(${resultCounts[type]})`}
          </Button>
        ))}
      </div>
    </div>
  )
}
