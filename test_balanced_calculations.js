// Test script to verify balanced teacher satisfaction calculations
import { calculateCurrentMetrics } from './src/lib/policyData.js';

console.log('Testing Balanced AI Education Policy Calculations\n');

// Test 1: Moderate teacher training should achieve good satisfaction
console.log('Test 1: Moderate Teacher Training (60% intensity)');
const test1Policies = ['PD_FUNDS'];
const test1Intensities = { 'PD_FUNDS': 60 };
const test1Results = calculateCurrentMetrics(test1Policies, test1Intensities);
console.log(`Teacher Satisfaction: ${test1Results.TEACHER_SATISFACTION.toFixed(1)} (should be good with moderate training)`);
console.log('');

// Test 2: High teacher training should achieve high satisfaction
console.log('Test 2: High Teacher Training (80% intensity)');
const test2Policies = ['PD_FUNDS'];
const test2Intensities = { 'PD_FUNDS': 80 };
const test2Results = calculateCurrentMetrics(test2Policies, test2Intensities);
console.log(`Teacher Satisfaction: ${test2Results.TEACHER_SATISFACTION.toFixed(1)} (should be high with strong training)`);
console.log('');

// Test 3: Educator autonomy without training (should have mild penalty)
console.log('Test 3: High Educator Autonomy without Training');
const test3Policies = ['EDUC_AUTONOMY'];
const test3Intensities = { 'EDUC_AUTONOMY': 80 };
const test3Results = calculateCurrentMetrics(test3Policies, test3Intensities);
console.log(`Teacher Satisfaction: ${test3Results.TEACHER_SATISFACTION.toFixed(1)} (should be moderate, not terrible)`);
console.log('');

// Test 4: Combined training and autonomy (should get synergy bonus)
console.log('Test 4: Combined Training + Autonomy (should get bonus)');
const test4Policies = ['PD_FUNDS', 'EDUC_AUTONOMY'];
const test4Intensities = { 'PD_FUNDS': 70, 'EDUC_AUTONOMY': 70 };
const test4Results = calculateCurrentMetrics(test4Policies, test4Intensities);
console.log(`Teacher Satisfaction: ${test4Results.TEACHER_SATISFACTION.toFixed(1)} (should be high with synergy bonus)`);
console.log('');

// Test 5: Triple supportive policies (training + autonomy + interoperability)
console.log('Test 5: Triple Supportive Policies (PD_FUNDS + EDUC_AUTONOMY + INTEROP_STD)');
const test5Policies = ['PD_FUNDS', 'EDUC_AUTONOMY', 'INTEROP_STD'];
const test5Intensities = { 'PD_FUNDS': 70, 'EDUC_AUTONOMY': 70, 'INTEROP_STD': 70 };
const test5Results = calculateCurrentMetrics(test5Policies, test5Intensities);
console.log(`Teacher Satisfaction: ${test5Results.TEACHER_SATISFACTION.toFixed(1)} (should be very high with multiple bonuses)`);
console.log('');

// Test 6: Infrastructure + Training combo bonus
console.log('Test 6: Infrastructure + Training Combo');
const test6Policies = ['INFRA_INVEST', 'PD_FUNDS'];
const test6Intensities = { 'INFRA_INVEST': 60, 'PD_FUNDS': 60 };
const test6Results = calculateCurrentMetrics(test6Policies, test6Intensities);
console.log(`Teacher Satisfaction: ${test6Results.TEACHER_SATISFACTION.toFixed(1)} (should get infrastructure+training bonus)`);
console.log('');

// Test 7: AI Integration without training (should be mild penalty)
console.log('Test 7: AI Integration without adequate support');
const test7Policies = ['AI_INTEGRATION'];
const test7Intensities = { 'AI_INTEGRATION': 80 };
const test7Results = calculateCurrentMetrics(test7Policies, test7Intensities);
console.log(`Teacher Satisfaction: ${test7Results.TEACHER_SATISFACTION.toFixed(1)} (should have mild penalty but still achievable)`);
console.log(`AI Literacy: ${test7Results.AI_LITERACY.toFixed(1)} (should still show some improvement)`);
console.log('');

console.log('Balanced Approach Summary:');
console.log('- Teacher satisfaction should be achievable with reasonable training investment');
console.log('- Penalties should be moderate, not devastating');
console.log('- Multiple supportive policies should provide synergy bonuses');
console.log('- Even suboptimal configurations should show some positive outcomes');
