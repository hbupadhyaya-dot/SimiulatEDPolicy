# Scenario System Documentation

## Overview

The Scenario System provides a comprehensive framework for simulating different external conditions and their impact on AI education policy outcomes. It allows users to explore how various scenarios affect the eight core outcome metrics in a deterministic and predictable manner.

## Architecture

### Core Components

1. **Types** (`src/types/scenario.ts`)
   - `ScenarioId`: Union type for scenario identifiers
   - `Outcomes`: Interface defining the eight outcome metrics
   - `Scenario`: Interface for scenario definitions
   - `ScenarioState` & `ScenarioActions`: Context state management types

2. **Scenarios** (`src/lib/scenarios.ts`)
   - `BASELINE_OUTCOMES`: Default values (all metrics at 50)
   - `SCENARIOS`: Configuration object with all scenario definitions
   - `applyScenario()`: Pure function for applying scenario deltas
   - `clamp()`: Utility for constraining values between 0-100
   - `getScenarioImpactSummary()`: Helper for generating tooltip text

3. **Context Store** (`src/contexts/ScenarioContext.tsx`)
   - React Context provider for global scenario state
   - Reducer-based state management
   - Custom hooks: `useScenario()`, `useOutcomes()`, `useScenarioActions()`

4. **UI Components**
   - `HeaderScenarioSelect`: Dropdown selector with tooltips
   - `OutcomesPanel`: Live display of current outcome values

## Available Scenarios

### 1. Normal Conditions (baseline)
- **ID**: `normal`
- **Description**: Baseline metrics with no external shocks
- **Deltas**: None (all metrics remain at 50)

### 2. Tool Bias Discovery
- **ID**: `bias`
- **Description**: Discovery of algorithmic bias in educational AI tools
- **Deltas**:
  - `aiVulnerability`: +20
  - `communityTrust`: -10
  - `digitalFairness`: -15
  - `teacherSatisfaction`: -5
  - `innovationIndex`: -5

### 3. Funding Cut
- **ID**: `funding`
- **Description**: Significant reduction in education technology funding
- **Deltas**:
  - `budgetStrain`: +25
  - `teacherSatisfaction`: -15
  - `aiLiteracy`: -10
  - `innovationIndex`: -10
  - `employability`: -5

### 4. Data Breach Incident
- **ID**: `breach`
- **Description**: Major data breach affecting student privacy and trust
- **Deltas**:
  - `aiVulnerability`: +30
  - `communityTrust`: -25
  - `teacherSatisfaction`: -10
  - `digitalFairness`: -10
  - `innovationIndex`: -5

## Outcome Metrics

The system tracks eight core outcome metrics, each ranging from 0-100:

1. **AI Literacy**: Student competency in AI understanding and usage
2. **Teacher Satisfaction**: Educator satisfaction with AI integration
3. **Employability**: Student preparation for AI-influenced workforce
4. **AI Vulnerability**: Security risks and system reliability
5. **Community Trust**: Stakeholder confidence in AI systems
6. **Innovation Index**: Educational AI innovation and adoption
7. **Digital Fairness**: Equity and bias in AI systems
8. **Budget Strain**: Financial pressure from AI implementation

## Usage

### Basic Usage

```jsx
import { ScenarioProvider, useScenarioStore } from './contexts/ScenarioContext';

function App() {
  return (
    <ScenarioProvider>
      <YourAppContent />
    </ScenarioProvider>
  );
}

function YourComponent() {
  const { state, actions } = useScenarioStore();
  
  // Access current scenario
  console.log(state.scenario); // 'normal' | 'bias' | 'funding' | 'breach'
  
  // Access current outcomes
  console.log(state.outcomes.aiLiteracy); // 50 (or modified by scenario)
  
  // Change scenario
  actions.setScenario('bias');
  
  // Reset to baseline
  actions.resetToBaseline();
}
```

### Using Individual Hooks

```jsx
import { useScenario, useOutcomes, useScenarioActions } from './contexts/ScenarioContext';

function MyComponent() {
  const scenario = useScenario();
  const outcomes = useOutcomes();
  const { setScenario, resetToBaseline } = useScenarioActions();
  
  return (
    <div>
      <p>Current scenario: {scenario}</p>
      <p>AI Literacy: {outcomes.aiLiteracy}</p>
      <button onClick={() => setScenario('funding')}>
        Apply Funding Cut
      </button>
    </div>
  );
}
```

## Adding New Scenarios

### 1. Update Types

Add the new scenario ID to the `ScenarioId` type:

```typescript
export type ScenarioId = 'normal' | 'bias' | 'funding' | 'breach' | 'your_new_scenario';
```

### 2. Define Scenario

Add the scenario definition to `SCENARIOS` in `src/lib/scenarios.ts`:

```typescript
export const SCENARIOS: Record<ScenarioId, Scenario> = {
  // ... existing scenarios
  your_new_scenario: {
    id: 'your_new_scenario',
    label: 'Your New Scenario',
    description: 'Description of what this scenario represents',
    deltas: {
      aiLiteracy: -5,
      teacherSatisfaction: +10,
      // ... other deltas
    },
  },
};
```

### 3. Update UI Components

Add the new scenario option to `HeaderScenarioSelect.jsx`:

```jsx
// The component automatically picks up new scenarios from SCENARIOS
// No changes needed if using the existing pattern
```

## Technical Details

### Deterministic Behavior

- Scenarios always apply deltas to the baseline (50) values
- Switching scenarios resets to baseline before applying new deltas
- No cumulative stacking of scenario effects
- Results are predictable and testable

### Value Clamping

All outcome values are automatically clamped between 0 and 100:

```typescript
const clamp = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};
```

### Pure Functions

The `applyScenario` function is pure and side-effect free:

```typescript
export const applyScenario = (baselineOutcomes: Outcomes, scenarioId: ScenarioId): Outcomes => {
  // Pure function - no side effects
  // Always returns new object, never mutates input
};
```

## Testing

Run the scenario tests:

```bash
npm test src/tests/scenarios.test.js
```

The test suite covers:
- Value clamping functionality
- Scenario delta application
- Baseline reset behavior
- Edge cases and error handling
- Integration scenarios

## Extension Points

### Percentage-Based Calculations

The system includes an extension point for future percentage-based calculations:

```typescript
export const applyScenarioWithMode = (
  baselineOutcomes: Outcomes,
  scenarioId: ScenarioId,
  mode: 'additive' | 'percentage' = 'additive'
): Outcomes => {
  // Future implementation for percentage mode
};
```

### Custom Baseline Values

You can apply scenarios to custom baseline values:

```typescript
const customBaseline = { aiLiteracy: 30, /* ... */ };
const result = applyScenario(customBaseline, 'bias');
```

## Performance Considerations

- Context updates are optimized with useReducer
- Scenario calculations are pure and memoizable
- UI components only re-render when necessary
- No unnecessary re-calculations on scenario changes

## Troubleshooting

### Common Issues

1. **Scenario not updating**: Ensure component is wrapped in `ScenarioProvider`
2. **Values not clamping**: Check that `clamp()` function is being used
3. **Type errors**: Verify all scenario IDs are included in `ScenarioId` type
4. **UI not reflecting changes**: Check that components are using the context hooks

### Debug Mode

Enable debug logging by adding console logs to the reducer:

```typescript
const scenarioReducer = (state: ScenarioState, action: ScenarioAction): ScenarioState => {
  console.log('Scenario action:', action);
  // ... reducer logic
};
```
