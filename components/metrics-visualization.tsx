import MetricsCard from "./metrics-card"

interface MetricsProps {
  metrics: {
    avgPrecision: number
    avgRecall: number
    avgNdcg: number
  }
}

export default function MetricsVisualization({ metrics }: MetricsProps) {
  return (
    <>
      <MetricsCard label="Precision" value={(metrics.avgPrecision * 100).toFixed(1)} unit="%" color="blue" />
      <MetricsCard label="Recall" value={(metrics.avgRecall * 100).toFixed(1)} unit="%" color="purple" />
      <MetricsCard label="nDCG" value={(metrics.avgNdcg * 100).toFixed(1)} unit="%" color="cyan" />
    </>
  )
}
