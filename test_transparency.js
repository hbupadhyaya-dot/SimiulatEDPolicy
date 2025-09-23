// Test script for transparency modal
import { getCalculationBreakdown, getAssumptionsPanel, policyDefinitions } from './src/lib/policyData.js';

console.log('=== Testing Transparency Modal ===\n');

// Test with some sample policies
const testPolicies = ['PD_FUNDS', 'INNOV_SANDBOX', 'AI_INTEGRATION'];
const testIntensities = { 'PD_FUNDS': 60, 'INNOV_SANDBOX': 45, 'AI_INTEGRATION': 70 };

console.log('Test Policies:');
testPolicies.forEach(policyId => {
  console.log(`- ${policyDefinitions[policyId]?.name} (${testIntensities[policyId]}%)`);
});
console.log('');

// Test breakdown
const breakdown = getCalculationBreakdown(testPolicies, testIntensities);
console.log('Policy Contributions:');
breakdown.policyContributions.forEach(contrib => {
  console.log(`- ${policyDefinitions[contrib.policy]?.name}: ${contrib.intensity}% (${contrib.category})`);
  Object.entries(contrib.contributions).forEach(([metric, value]) => {
    if (Math.abs(value) > 0.1) {
      console.log(`  ${metric}: ${value > 0 ? '+' : ''}${value.toFixed(1)} points`);
    }
  });
});
console.log('');

// Test synergies
console.log('Synergy Effects:');
breakdown.synergyEffects.forEach(synergy => {
  console.log(`- ${synergy.policies.map(p => policyDefinitions[p]?.name).join(' + ')}`);
});
console.log('');

// Test assumptions
const assumptions = getAssumptionsPanel();
console.log('Trust-mediated policies:', assumptions.trustFeedback.affectedPolicies.join(', '));
console.log('Budget-affected policies:', assumptions.budgetThrottling.affectedPolicies.join(', '));
console.log('');

console.log('=== Test Completed Successfully ===');
