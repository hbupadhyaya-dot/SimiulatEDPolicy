import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { outcomeMetrics, calculateCurrentMetrics, generateTimeSeriesData } from '../lib/policyData'

// Time Series Chart Component
export function TimeSeriesChart({ metricId, selectedPolicies, policyIntensities, shockScenario }) {
  const data = useMemo(() => {
    try {
      const years = Array.from({ length: 16 }, (_, i) => 2025 + i)
      const baseData = generateTimeSeriesData(metricId, selectedPolicies, policyIntensities)
      return years.map((year, index) => ({
        year: year,
        current: baseData[index]?.current || 50,
        baseline: baseData[index]?.baseline || 50
      }))
    } catch (error) {
      console.error('Error generating time series data:', error)
      return []
    }
  }, [metricId, selectedPolicies, policyIntensities])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 25, left: 10, bottom: 15 }}>
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} ticks={[2025, 2028, 2031, 2034, 2037, 2040]} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} interval={0} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} />
          <Line type="monotone" dataKey="baseline" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Spider Chart Component
export function SpiderChart({ selectedPolicies, policyIntensities, shockScenario, size = 400 }) {
  const data = useMemo(() => {
    try {
      const currentMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities)
      return Object.entries(outcomeMetrics).map(([metricId, metric]) => ({
        metric: metric.name,
        value: currentMetrics[metricId] || 50
      }))
    } catch (error) {
      console.error('Error calculating spider chart data:', error)
      return []
    }
  }, [selectedPolicies, policyIntensities])

  return (
    <div style={{ width: size, height: size }}>
      <RadarChart width={size} height={size} data={data} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
      </RadarChart>
    </div>
  )
}


