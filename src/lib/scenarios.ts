// Scenario definitions and outcome calculation logic

import { ScenarioId, Outcomes, Scenario } from '../types/scenario';

// Baseline outcomes - all metrics start at 50
export const BASELINE_OUTCOMES: Outcomes = {
  aiLiteracy: 50,
  teacherSatisfaction: 50,
  employability: 50,
  aiVulnerability: 50,
  communityTrust: 50,
  innovationIndex: 50,
  digitalFairness: 50,
  budgetStrain: 50,
};

// Scenario definitions with deltas
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  normal: {
    id: 'normal',
    label: 'Normal Conditions',
    description: 'Baseline metrics with no external shocks or changes',
    deltas: {},
  },
  bias: {
    id: 'bias',
    label: 'Tool Bias Discovery',
    description: 'Discovery of algorithmic bias in educational AI tools',
    deltas: {
      aiVulnerability: 15, // 50 + 15 = 65 (capped)
      communityTrust: -10,
      digitalFairness: -15,
      teacherSatisfaction: -5,
      innovationIndex: -5,
    },
  },
  funding: {
    id: 'funding',
    label: 'Funding Cut',
    description: 'Significant reduction in education technology funding',
    deltas: {
      budgetStrain: 15, // 50 + 15 = 65 (starts at 65)
      teacherSatisfaction: -15,
      aiLiteracy: -10,
      innovationIndex: -10,
      employability: -5,
    },
  },
  breach: {
    id: 'breach',
    label: 'Data Breach Incident',
    description: 'Major data breach affecting student privacy and trust',
    deltas: {
      aiVulnerability: 15, // 50 + 15 = 65 (capped)
      communityTrust: -25,
      teacherSatisfaction: -10,
      digitalFairness: -10,
      innovationIndex: -5,
    },
  },
};

// Clamp value between 0 and 100
export const clamp = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

// Apply scenario deltas to baseline outcomes
export const applyScenario = (baselineOutcomes: Outcomes, scenarioId: ScenarioId): Outcomes => {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) {
    console.warn(`Unknown scenario: ${scenarioId}`);
    return baselineOutcomes;
  }

  const result: Outcomes = { ...baselineOutcomes };

  // Apply deltas additively
  Object.entries(scenario.deltas).forEach(([key, delta]) => {
    if (delta !== undefined) {
      const outcomeKey = key as keyof Outcomes;
      result[outcomeKey] = clamp(result[outcomeKey] + delta);
    }
  });

  return result;
};

// Reset to baseline (normal conditions)
export const resetToBaseline = (): Outcomes => {
  return { ...BASELINE_OUTCOMES };
};

// Get scenario impact summary for tooltips
export const getScenarioImpactSummary = (scenarioId: ScenarioId): string => {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario || scenarioId === 'normal') {
    return 'Normal Conditions: All metrics at baseline (50)';
  }

  const impacts: string[] = [];
  Object.entries(scenario.deltas).forEach(([key, delta]) => {
    if (delta !== undefined) {
      const outcomeKey = key as keyof Outcomes;
      const direction = delta > 0 ? '↑' : '↓';
      const impact = `${direction} ${outcomeKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      impacts.push(impact);
    }
  });

  return `${scenario.label}: ${impacts.join(', ')}`;
};

// Extension point for future percentage-based calculations
export const applyScenarioWithMode = (
  baselineOutcomes: Outcomes,
  scenarioId: ScenarioId,
  mode: 'additive' | 'percentage' = 'additive'
): Outcomes => {
  if (mode === 'percentage') {
    // Future implementation for percentage-based calculations
    console.warn('Percentage mode not yet implemented, falling back to additive');
  }
  
  return applyScenario(baselineOutcomes, scenarioId);
};
