// Test script for enhanced policy calculations
import { calculateCurrentMetrics, getCalculationBreakdown, getAssumptionsPanel } from './src/lib/policyData.js';

console.log('=== Testing Enhanced Policy Calculations ===\n');

// Test case 1: Basic intensity curve
console.log('Test 1: S-curve intensity mapping');
const testPolicies1 = ['PD_FUNDS', 'AI_INTEGRATION'];
const testIntensities1 = { 'PD_FUNDS': 50, 'AI_INTEGRATION': 75 };
const metrics1 = calculateCurrentMetrics(testPolicies1, testIntensities1);
console.log('Policies:', testPolicies1);
console.log('Intensities:', testIntensities1);
console.log('Results:', {
  AI_LITERACY: metrics1.AI_LITERACY.toFixed(1),
  TEACHER_SATISFACTION: metrics1.TEACHER_SATISFACTION.toFixed(1),
  COMMUNITY_TRUST: metrics1.COMMUNITY_TRUST.toFixed(1)
});
console.log('');

// Test case 2: Synergy gating (both policies >= 35)
console.log('Test 2: Synergy gating (both >= 35)');
const testPolicies2 = ['INFRA_INVEST', 'ACCESS_STD'];
const testIntensities2 = { 'INFRA_INVEST': 40, 'ACCESS_STD': 45 };
const metrics2 = calculateCurrentMetrics(testPolicies2, testIntensities2);
console.log('Policies:', testPolicies2);
console.log('Intensities:', testIntensities2);
console.log('Digital Equity (should have synergy):', metrics2.DIGITAL_EQUITY.toFixed(1));
console.log('');

// Test case 3: Synergy gating blocked (one policy < 35)
console.log('Test 3: Synergy gating blocked (one < 35)');
const testPolicies3 = ['INFRA_INVEST', 'ACCESS_STD'];
const testIntensities3 = { 'INFRA_INVEST': 30, 'ACCESS_STD': 45 };
const metrics3 = calculateCurrentMetrics(testPolicies3, testIntensities3);
console.log('Policies:', testPolicies3);
console.log('Intensities:', testIntensities3);
console.log('Digital Equity (synergy blocked):', metrics3.DIGITAL_EQUITY.toFixed(1));
console.log('');

// Test case 4: Trust-mediated adoption
console.log('Test 4: Trust-mediated adoption for AI policies');
const testPolicies4 = ['AI_INTEGRATION', 'COMM_INPUT'];
const testIntensities4 = { 'AI_INTEGRATION': 60, 'COMM_INPUT': 70 };
const metrics4 = calculateCurrentMetrics(testPolicies4, testIntensities4);
console.log('Policies:', testPolicies4);
console.log('Intensities:', testIntensities4);
console.log('Community Trust:', metrics4.COMMUNITY_TRUST.toFixed(1));
console.log('AI Literacy (trust-mediated):', metrics4.AI_LITERACY.toFixed(1));
console.log('');

// Test case 5: Budget throttling
console.log('Test 5: Budget throttling when strain > 70');
const testPolicies5 = ['INFRA_INVEST', 'PD_FUNDS', 'DATA_ANALYTICS'];
const testIntensities5 = { 'INFRA_INVEST': 80, 'PD_FUNDS': 80, 'DATA_ANALYTICS': 70 };
const metrics5 = calculateCurrentMetrics(testPolicies5, testIntensities5);
console.log('Policies:', testPolicies5);
console.log('Intensities:', testIntensities5);
console.log('Budget Strain:', metrics5.BUDGET_STRAIN.toFixed(1));
console.log('AI Literacy (should be throttled if budget high):', metrics5.AI_LITERACY.toFixed(1));
console.log('');

// Test case 6: Metric caps
console.log('Test 6: Per-metric delta caps');
const testPolicies6 = ['AI_INTEGRATION', 'DIGITAL_CITIZEN', 'PD_FUNDS'];
const testIntensities6 = { 'AI_INTEGRATION': 100, 'DIGITAL_CITIZEN': 100, 'PD_FUNDS': 100 };
const metrics6 = calculateCurrentMetrics(testPolicies6, testIntensities6);
console.log('Policies:', testPolicies6);
console.log('Intensities (all 100%):', testIntensities6);
console.log('AI Literacy (capped at +8):', (metrics6.AI_LITERACY - 50).toFixed(1));
console.log('Teacher Satisfaction (capped at +6):', (metrics6.TEACHER_SATISFACTION - 50).toFixed(1));
console.log('');

// Test calculation breakdown
console.log('Test 7: Calculation breakdown for transparency');
const breakdown = getCalculationBreakdown(['PD_FUNDS', 'AI_INTEGRATION'], { 'PD_FUNDS': 60, 'AI_INTEGRATION': 45 });
console.log('Policy contributions:');
breakdown.policyContributions.forEach(contrib => {
  console.log(`- ${contrib.policy} (${contrib.intensity}%): intensity factor = ${contrib.intensityFactor}`);
});
console.log('Synergy effects:', breakdown.synergyEffects.length, 'pairs');
console.log('');

// Test assumptions panel
console.log('Test 8: Assumptions panel');
const assumptions = getAssumptionsPanel();
console.log('Intensity curve formula:', assumptions.intensityCurve.formula);
console.log('Metric caps:', assumptions.metricCaps.caps);
console.log('Trust feedback formula:', assumptions.trustFeedback.formula);
console.log('');

console.log('=== All Tests Completed ===');
