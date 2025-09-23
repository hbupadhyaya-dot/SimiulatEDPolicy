// Test script to verify balanced budget strain calculations
import { calculateCurrentMetrics } from './src/lib/policyData.js';

console.log('Testing Balanced Budget Strain Calculations\n');

// Test 1: Single moderate policy (should have minimal budget impact)
console.log('Test 1: Single Moderate Policy (PD_FUNDS at 60%)');
const test1Policies = ['PD_FUNDS'];
const test1Intensities = { 'PD_FUNDS': 60 };
const test1Results = calculateCurrentMetrics(test1Policies, test1Intensities);
console.log(`Budget Strain: ${test1Results.BUDGET_STRAIN.toFixed(1)} (should be manageable)`);
console.log(`Teacher Satisfaction: ${test1Results.TEACHER_SATISFACTION.toFixed(1)}`);
console.log('');

// Test 2: Single high-intensity policy (should be moderate budget impact)
console.log('Test 2: Single High Policy (INFRA_INVEST at 80%)');
const test2Policies = ['INFRA_INVEST'];
const test2Intensities = { 'INFRA_INVEST': 80 };
const test2Results = calculateCurrentMetrics(test2Policies, test2Intensities);
console.log(`Budget Strain: ${test2Results.BUDGET_STRAIN.toFixed(1)} (should be moderate, not extreme)`);
console.log('');

// Test 3: Two moderate policies (should be reasonable)
console.log('Test 3: Two Moderate Policies (PD_FUNDS + INFRA_INVEST at 60%)');
const test3Policies = ['PD_FUNDS', 'INFRA_INVEST'];
const test3Intensities = { 'PD_FUNDS': 60, 'INFRA_INVEST': 60 };
const test3Results = calculateCurrentMetrics(test3Policies, test3Intensities);
console.log(`Budget Strain: ${test3Results.BUDGET_STRAIN.toFixed(1)} (should be reasonable for two policies)`);
console.log('');

// Test 4: Two high policies (should get additional pressure but not extreme)
console.log('Test 4: Two High Policies (PD_FUNDS + INFRA_INVEST at 80%)');
const test4Policies = ['PD_FUNDS', 'INFRA_INVEST'];
const test4Intensities = { 'PD_FUNDS': 80, 'INFRA_INVEST': 80 };
const test4Results = calculateCurrentMetrics(test4Policies, test4Intensities);
console.log(`Budget Strain: ${test4Results.BUDGET_STRAIN.toFixed(1)} (should have additional pressure but still manageable)`);
console.log('');

// Test 5: Three high policies (should be challenging but not impossible)
console.log('Test 5: Three High Policies (PD_FUNDS + INFRA_INVEST + INNOV_SANDBOX at 75%)');
const test5Policies = ['PD_FUNDS', 'INFRA_INVEST', 'INNOV_SANDBOX'];
const test5Intensities = { 'PD_FUNDS': 75, 'INFRA_INVEST': 75, 'INNOV_SANDBOX': 75 };
const test5Results = calculateCurrentMetrics(test5Policies, test5Intensities);
console.log(`Budget Strain: ${test5Results.BUDGET_STRAIN.toFixed(1)} (should be high but not maxed out)`);
console.log(`Innovation Index: ${test5Results.INNOVATION_INDEX.toFixed(1)} (should still show good results)`);
console.log('');

// Test 6: Four expensive policies at maximum (extreme case)
console.log('Test 6: Four Expensive Policies at Maximum (90% each)');
const test6Policies = ['PD_FUNDS', 'INFRA_INVEST', 'INNOV_SANDBOX', 'DATA_ANALYTICS'];
const test6Intensities = { 
  'PD_FUNDS': 90, 
  'INFRA_INVEST': 90, 
  'INNOV_SANDBOX': 90, 
  'DATA_ANALYTICS': 90 
};
const test6Results = calculateCurrentMetrics(test6Policies, test6Intensities);
console.log(`Budget Strain: ${test6Results.BUDGET_STRAIN.toFixed(1)} (should be very high but still leave room for other outcomes)`);
console.log(`AI Literacy: ${test6Results.AI_LITERACY.toFixed(1)} (should still show significant improvement)`);
console.log('');

// Test 7: Mixed intensity approach (realistic scenario)
console.log('Test 7: Mixed Intensity Approach (Strategic balance)');
const test7Policies = ['PD_FUNDS', 'INFRA_INVEST', 'EDUC_AUTONOMY', 'DIGITAL_CITIZEN'];
const test7Intensities = { 
  'PD_FUNDS': 70,      // High priority
  'INFRA_INVEST': 50,  // Moderate
  'EDUC_AUTONOMY': 60, // Moderate-high
  'DIGITAL_CITIZEN': 40 // Lower priority
};
const test7Results = calculateCurrentMetrics(test7Policies, test7Intensities);
console.log(`Budget Strain: ${test7Results.BUDGET_STRAIN.toFixed(1)} (should be very manageable with strategic balance)`);
console.log(`Teacher Satisfaction: ${test7Results.TEACHER_SATISFACTION.toFixed(1)}`);
console.log(`AI Literacy: ${test7Results.AI_LITERACY.toFixed(1)}`);
console.log('');

console.log('Budget Balance Summary:');
console.log('- Single policies should have manageable budget impact');
console.log('- Multiple moderate policies should be sustainable');
console.log('- High-intensity combinations should be challenging but not prohibitive');
console.log('- Strategic mixed-intensity approaches should be rewarded with better balance');
