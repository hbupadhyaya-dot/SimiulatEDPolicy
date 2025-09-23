// Test script to verify realistic calculations
import { calculateCurrentMetrics } from './src/lib/policyData.js';

console.log('Testing Realistic AI Education Policy Calculations\n');

// Test 1: High teacher satisfaction without training (should be low)
console.log('Test 1: High Educator Autonomy without Teacher Training');
const test1Policies = ['EDUC_AUTONOMY'];
const test1Intensities = { 'EDUC_AUTONOMY': 90 };
const test1Results = calculateCurrentMetrics(test1Policies, test1Intensities);
console.log(`Teacher Satisfaction: ${test1Results.TEACHER_SATISFACTION.toFixed(1)} (should be low without training)`);
console.log('');

// Test 2: High teacher training should improve satisfaction significantly
console.log('Test 2: High Teacher Training');
const test2Policies = ['PD_FUNDS'];
const test2Intensities = { 'PD_FUNDS': 90 };
const test2Results = calculateCurrentMetrics(test2Policies, test2Intensities);
console.log(`Teacher Satisfaction: ${test2Results.TEACHER_SATISFACTION.toFixed(1)} (should be high with training)`);
console.log(`Budget Strain: ${test2Results.BUDGET_STRAIN.toFixed(1)} (should be elevated due to costs)`);
console.log('');

// Test 3: Combined training and autonomy (should be synergistic)
console.log('Test 3: Combined Teacher Training + Educator Autonomy');
const test3Policies = ['PD_FUNDS', 'EDUC_AUTONOMY'];
const test3Intensities = { 'PD_FUNDS': 80, 'EDUC_AUTONOMY': 80 };
const test3Results = calculateCurrentMetrics(test3Policies, test3Intensities);
console.log(`Teacher Satisfaction: ${test3Results.TEACHER_SATISFACTION.toFixed(1)} (should be highest)`);
console.log(`Budget Strain: ${test3Results.BUDGET_STRAIN.toFixed(1)} (should be moderate)`);
console.log('');

// Test 4: AI Integration without infrastructure (should cause problems)
console.log('Test 4: AI Integration without Infrastructure');
const test4Policies = ['AI_INTEGRATION'];
const test4Intensities = { 'AI_INTEGRATION': 90 };
const test4Results = calculateCurrentMetrics(test4Policies, test4Intensities);
console.log(`AI Literacy: ${test4Results.AI_LITERACY.toFixed(1)} (should be limited without infrastructure)`);
console.log(`Teacher Satisfaction: ${test4Results.TEACHER_SATISFACTION.toFixed(1)} (should be low due to frustration)`);
console.log('');

// Test 5: Full infrastructure + training + integration (should be optimal)
console.log('Test 5: Full Infrastructure + Training + AI Integration');
const test5Policies = ['INFRA_INVEST', 'PD_FUNDS', 'AI_INTEGRATION'];
const test5Intensities = { 'INFRA_INVEST': 80, 'PD_FUNDS': 80, 'AI_INTEGRATION': 80 };
const test5Results = calculateCurrentMetrics(test5Policies, test5Intensities);
console.log(`AI Literacy: ${test5Results.AI_LITERACY.toFixed(1)} (should be high with proper foundation)`);
console.log(`Teacher Satisfaction: ${test5Results.TEACHER_SATISFACTION.toFixed(1)} (should be high with support)`);
console.log(`Budget Strain: ${test5Results.BUDGET_STRAIN.toFixed(1)} (should be high due to multiple expensive policies)`);
console.log('');

// Test 6: Multiple expensive policies (budget strain test)
console.log('Test 6: Multiple High-Cost Policies');
const test6Policies = ['PD_FUNDS', 'INFRA_INVEST', 'INNOV_SANDBOX', 'DATA_ANALYTICS'];
const test6Intensities = { 
  'PD_FUNDS': 90, 
  'INFRA_INVEST': 90, 
  'INNOV_SANDBOX': 90, 
  'DATA_ANALYTICS': 90 
};
const test6Results = calculateCurrentMetrics(test6Policies, test6Intensities);
console.log(`Budget Strain: ${test6Results.BUDGET_STRAIN.toFixed(1)} (should be very high)`);
console.log(`Innovation Index: ${test6Results.INNOVATION_INDEX.toFixed(1)} (should be high but constrained by diminishing returns)`);
console.log('');

console.log('Test Summary:');
console.log('- Teacher satisfaction should now require proper training');
console.log('- AI integration should be limited without infrastructure');
console.log('- Budget strain should increase significantly with multiple expensive policies');
console.log('- Diminishing returns should prevent unrealistic "green zone" outcomes');
