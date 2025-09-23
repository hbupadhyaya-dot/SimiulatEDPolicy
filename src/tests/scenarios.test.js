// Unit tests for scenario functions

import { describe, test, expect } from 'vitest';
import { 
  BASELINE_OUTCOMES, 
  applyScenario, 
  clamp, 
  resetToBaseline,
  getScenarioImpactSummary 
} from '../lib/scenarios';

describe('Scenario Functions', () => {
  describe('clamp', () => {
    test('should clamp values between 0 and 100', () => {
      expect(clamp(-10)).toBe(0);
      expect(clamp(0)).toBe(0);
      expect(clamp(50)).toBe(50);
      expect(clamp(100)).toBe(100);
      expect(clamp(150)).toBe(100);
    });

    test('should handle decimal values', () => {
      expect(clamp(50.5)).toBe(50.5);
      expect(clamp(99.9)).toBe(99.9);
      expect(clamp(100.1)).toBe(100);
    });
  });

  describe('resetToBaseline', () => {
    test('should return baseline outcomes with all values at 50', () => {
      const result = resetToBaseline();
      expect(result).toEqual(BASELINE_OUTCOMES);
      expect(result.aiLiteracy).toBe(50);
      expect(result.teacherSatisfaction).toBe(50);
      expect(result.employability).toBe(50);
      expect(result.aiVulnerability).toBe(50);
      expect(result.communityTrust).toBe(50);
      expect(result.innovationIndex).toBe(50);
      expect(result.digitalFairness).toBe(50);
      expect(result.budgetStrain).toBe(50);
    });
  });

  describe('applyScenario', () => {
    test('should return baseline for normal scenario', () => {
      const result = applyScenario(BASELINE_OUTCOMES, 'normal');
      expect(result).toEqual(BASELINE_OUTCOMES);
    });

    test('should apply bias scenario deltas correctly', () => {
      const result = applyScenario(BASELINE_OUTCOMES, 'bias');
      
      // Tool Bias Discovery deltas:
      // aiVulnerability +20, communityTrust -10, digitalFairness -15, 
      // teacherSatisfaction -5, innovationIndex -5
      expect(result.aiVulnerability).toBe(70); // 50 + 20
      expect(result.communityTrust).toBe(40);  // 50 - 10
      expect(result.digitalFairness).toBe(35); // 50 - 15
      expect(result.teacherSatisfaction).toBe(45); // 50 - 5
      expect(result.innovationIndex).toBe(45); // 50 - 5
      
      // Unchanged metrics
      expect(result.aiLiteracy).toBe(50);
      expect(result.employability).toBe(50);
      expect(result.budgetStrain).toBe(50);
    });

    test('should apply funding scenario deltas correctly', () => {
      const result = applyScenario(BASELINE_OUTCOMES, 'funding');
      
      // Funding Cut deltas:
      // budgetStrain +25, teacherSatisfaction -15, aiLiteracy -10, 
      // innovationIndex -10, employability -5
      expect(result.budgetStrain).toBe(75); // 50 + 25
      expect(result.teacherSatisfaction).toBe(35); // 50 - 15
      expect(result.aiLiteracy).toBe(40); // 50 - 10
      expect(result.innovationIndex).toBe(40); // 50 - 10
      expect(result.employability).toBe(45); // 50 - 5
      
      // Unchanged metrics
      expect(result.aiVulnerability).toBe(50);
      expect(result.communityTrust).toBe(50);
      expect(result.digitalFairness).toBe(50);
    });

    test('should apply breach scenario deltas correctly', () => {
      const result = applyScenario(BASELINE_OUTCOMES, 'breach');
      
      // Data Breach Incident deltas:
      // aiVulnerability +30, communityTrust -25, teacherSatisfaction -10, 
      // digitalFairness -10, innovationIndex -5
      expect(result.aiVulnerability).toBe(80); // 50 + 30
      expect(result.communityTrust).toBe(25); // 50 - 25
      expect(result.teacherSatisfaction).toBe(40); // 50 - 10
      expect(result.digitalFairness).toBe(40); // 50 - 10
      expect(result.innovationIndex).toBe(45); // 50 - 5
      
      // Unchanged metrics
      expect(result.aiLiteracy).toBe(50);
      expect(result.employability).toBe(50);
      expect(result.budgetStrain).toBe(50);
    });

    test('should clamp values that exceed bounds', () => {
      // Create a custom baseline with high values to test clamping
      const highBaseline = {
        aiLiteracy: 90,
        teacherSatisfaction: 90,
        employability: 90,
        aiVulnerability: 90,
        communityTrust: 90,
        innovationIndex: 90,
        digitalFairness: 90,
        budgetStrain: 90,
      };

      const result = applyScenario(highBaseline, 'bias');
      
      // aiVulnerability should be clamped to 100 (90 + 20 = 110 -> 100)
      expect(result.aiVulnerability).toBe(100);
      
      // Other values should be within bounds
      expect(result.communityTrust).toBe(80); // 90 - 10
      expect(result.digitalFairness).toBe(75); // 90 - 15
    });

    test('should handle unknown scenario gracefully', () => {
      const result = applyScenario(BASELINE_OUTCOMES, 'unknown');
      expect(result).toEqual(BASELINE_OUTCOMES);
    });

    test('should not mutate original baseline', () => {
      const original = { ...BASELINE_OUTCOMES };
      applyScenario(BASELINE_OUTCOMES, 'bias');
      expect(BASELINE_OUTCOMES).toEqual(original);
    });
  });

  describe('getScenarioImpactSummary', () => {
    test('should return correct summary for normal scenario', () => {
      const result = getScenarioImpactSummary('normal');
      expect(result).toBe('Normal Conditions: All metrics at baseline (50)');
    });

    test('should return correct summary for bias scenario', () => {
      const result = getScenarioImpactSummary('bias');
      expect(result).toContain('Tool Bias Discovery');
      expect(result).toContain('↑ ai vulnerability');
      expect(result).toContain('↓ community trust');
      expect(result).toContain('↓ digital fairness');
    });

    test('should return correct summary for funding scenario', () => {
      const result = getScenarioImpactSummary('funding');
      expect(result).toContain('Funding Cut');
      expect(result).toContain('↑ budget strain');
      expect(result).toContain('↓ teacher satisfaction');
      expect(result).toContain('↓ ai literacy');
    });

    test('should return correct summary for breach scenario', () => {
      const result = getScenarioImpactSummary('breach');
      expect(result).toContain('Data Breach Incident');
      expect(result).toContain('↑ ai vulnerability');
      expect(result).toContain('↓ community trust');
      expect(result).toContain('↓ teacher satisfaction');
    });
  });

  describe('Integration tests', () => {
    test('should work with different baseline values', () => {
      const customBaseline = {
        aiLiteracy: 30,
        teacherSatisfaction: 70,
        employability: 60,
        aiVulnerability: 20,
        communityTrust: 80,
        innovationIndex: 40,
        digitalFairness: 90,
        budgetStrain: 10,
      };

      const result = applyScenario(customBaseline, 'bias');
      
      // Should apply deltas to custom baseline
      expect(result.aiVulnerability).toBe(40); // 20 + 20
      expect(result.communityTrust).toBe(70); // 80 - 10
      expect(result.digitalFairness).toBe(75); // 90 - 15
      expect(result.teacherSatisfaction).toBe(65); // 70 - 5
      expect(result.innovationIndex).toBe(35); // 40 - 5
    });

    test('should handle multiple scenario applications', () => {
      // Apply bias scenario
      const biasResult = applyScenario(BASELINE_OUTCOMES, 'bias');
      
      // Apply funding scenario to bias result (simulating cumulative effects)
      const fundingResult = applyScenario(biasResult, 'funding');
      
      // Should have both sets of deltas applied
      expect(fundingResult.budgetStrain).toBe(75); // 50 + 25 (funding)
      expect(fundingResult.aiVulnerability).toBe(70); // 50 + 20 (bias)
      expect(fundingResult.communityTrust).toBe(40); // 50 - 10 (bias)
    });
  });
});
