// Scenario and Outcomes Type Definitions

export type ScenarioId = 'normal' | 'bias' | 'funding' | 'breach';

export interface Outcomes {
  aiLiteracy: number;
  teacherSatisfaction: number;
  employability: number;
  aiVulnerability: number;
  communityTrust: number;
  innovationIndex: number;
  digitalFairness: number;
  budgetStrain: number;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  deltas: Partial<Outcomes>;
}

export interface ScenarioState {
  scenario: ScenarioId;
  outcomes: Outcomes;
}

export interface ScenarioActions {
  setScenario: (id: ScenarioId) => void;
  resetToBaseline: () => void;
}
