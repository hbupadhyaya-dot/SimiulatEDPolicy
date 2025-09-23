// React Context for scenario state management

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ScenarioId, Outcomes, ScenarioState, ScenarioActions } from '../types/scenario';
import { BASELINE_OUTCOMES, applyScenario, resetToBaseline } from '../lib/scenarios';

// Action types
type ScenarioAction = 
  | { type: 'SET_SCENARIO'; payload: ScenarioId }
  | { type: 'RESET_TO_BASELINE' };

// Initial state
const initialState: ScenarioState = {
  scenario: 'normal',
  outcomes: BASELINE_OUTCOMES,
};

// Reducer
const scenarioReducer = (state: ScenarioState, action: ScenarioAction): ScenarioState => {
  switch (action.type) {
    case 'SET_SCENARIO':
      return {
        scenario: action.payload,
        outcomes: applyScenario(BASELINE_OUTCOMES, action.payload),
      };
    case 'RESET_TO_BASELINE':
      return {
        scenario: 'normal',
        outcomes: resetToBaseline(),
      };
    default:
      return state;
  }
};

// Context
const ScenarioContext = createContext<{
  state: ScenarioState;
  actions: ScenarioActions;
} | null>(null);

// Provider component
export const ScenarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scenarioReducer, initialState);

  const actions: ScenarioActions = {
    setScenario: (id: ScenarioId) => {
      dispatch({ type: 'SET_SCENARIO', payload: id });
    },
    resetToBaseline: () => {
      dispatch({ type: 'RESET_TO_BASELINE' });
    },
  };

  return (
    <ScenarioContext.Provider value={{ state, actions }}>
      {children}
    </ScenarioContext.Provider>
  );
};

// Custom hooks
export const useScenario = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context.state.scenario;
};

export const useOutcomes = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useOutcomes must be used within a ScenarioProvider');
  }
  return context.state.outcomes;
};

export const useScenarioActions = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioActions must be used within a ScenarioProvider');
  }
  return context.actions;
};

// Combined hook for convenience
export const useScenarioStore = () => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenarioStore must be used within a ScenarioProvider');
  }
  return context;
};
