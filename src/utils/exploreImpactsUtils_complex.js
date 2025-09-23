// Utility functions for Explore Impacts feature

/**
 * Classify strategy based on selected policies and their intensities
 * @param {Array} selectedPolicies - Array of policy objects with id, name, category, intensity
 * @returns {Object} - { label, rationale, clusterScores, confidence }
 */
export function classifyStrategy(selectedPolicies) {
  // All policies are always selected, so we don't need a minimum count check
  // Instead, check if we have any policies with meaningful implementation level
  const activePolicies = selectedPolicies.filter(p => (p.intensity || 0) > 0);
  
  if (activePolicies.length < 3) {
    return {
      label: "Insufficient Implementation",
      rationale: "Need at least 3 policies with implementation level > 0% to analyze strategy patterns. All policies are available - adjust their implementation levels.",
      clusterScores: {},
      confidence: "low"
    };
  }

  // Define policy clusters based on categories
  const clusters = {
    governance: {
      policies: ['PROTECT_STD', 'MODEL_EVAL_STD', 'IMPACT_REP_STD', 'ACCESS_STD', 'INTEROP_STD', 'STATE_FED_PART'],
      name: "Governance & Safety"
    },
    capacity: {
      policies: ['PD_FUNDS', 'INFRA_INVEST', 'DATA_ANALYTICS', 'AI_INTEGRATION', 'INNOV_SANDBOX'],
      name: "Infrastructure & Capacity"
    },
    culture: {
      policies: ['EDUC_AUTONOMY', 'DIGITAL_CITIZEN', 'COMM_INPUT', 'LOCAL_JOB_ALIGN'],
      name: "Culture & Community"
    }
  };

  // Calculate cluster scores based on average policy intensities in each cluster
  const clusterScores = {};
  Object.keys(clusters).forEach(clusterKey => {
    const cluster = clusters[clusterKey];
    let totalIntensity = 0;
    let policyCount = 0;

    selectedPolicies.forEach(policy => {
      if (cluster.policies.includes(policy.id)) {
        totalIntensity += policy.intensity || 0; // All policies count, 0 intensity is valid
        policyCount++;
      }
    });

    // Calculate average intensity for this cluster (including 0% policies)
    clusterScores[clusterKey] = policyCount > 0 ? totalIntensity / policyCount : 0;
  });

  // Determine dominant strategy based on cluster with highest average intensity
  const maxScore = Math.max(...Object.values(clusterScores));
  const dominantCluster = Object.keys(clusterScores).find(key => clusterScores[key] === maxScore);

  // Generate strategy label and rationale
  let label, rationale;
  const avgIntensity = selectedPolicies.reduce((sum, p) => sum + (p.intensity || 0), 0) / selectedPolicies.length;

  if (maxScore < 30) {
    label = "Conservative Approach";
    rationale = "Low-intensity implementation across multiple policy areas, focusing on gradual change with minimal risk.";
  } else if (maxScore >= 30 && maxScore < 60) {
    if (dominantCluster === 'governance') {
      label = "Safety-First Strategy";
      rationale = "Balanced approach prioritizing student protection and regulatory compliance while building capacity.";
    } else if (dominantCluster === 'capacity') {
      label = "Infrastructure-Focused Strategy";
      rationale = "Strategic investment in technology and training to build foundational capabilities for AI integration.";
    } else {
      label = "Community-Centered Strategy";
      rationale = "Emphasis on stakeholder engagement and cultural change to build trust and support for AI initiatives.";
    }
  } else {
    if (dominantCluster === 'governance') {
      label = "Comprehensive Governance";
      rationale = "Strong regulatory framework with robust safety standards and transparent reporting mechanisms.";
    } else if (dominantCluster === 'capacity') {
      label = "Technology Transformation";
      rationale = "Aggressive investment in infrastructure and training to rapidly modernize educational capabilities.";
    } else {
      label = "Community Partnership";
      rationale = "Deep engagement with stakeholders to co-create AI policies that reflect local values and needs.";
    }
  }

  // Calculate confidence based on policy distribution and intensity variance
  const adjustedPolicies = selectedPolicies.filter(p => (p.intensity || 0) !== 0);
  const clusterDistribution = Object.values(clusterScores).filter(score => Math.abs(score - 0) > 5).length;
  
  let confidence = "low";
  if (adjustedPolicies.length >= 4 && clusterDistribution >= 2) {
    confidence = "high";
  } else if (adjustedPolicies.length >= 3 || clusterDistribution >= 2) {
    confidence = "medium";
  }

  return {
    label,
    rationale,
    clusterScores,
    confidence
  };
}

/**
 * Compute confidence level based on contribution complexity
 * @param {Object} contributions - Object with base, intensity, prereq, synergy, tension, trust, budget, diminish values
 * @returns {string} - 'low' | 'medium' | 'high'
 */
export function computeConfidence(contributions) {
  const nonZeroTerms = Object.values(contributions).filter(value => Math.abs(value) > 0.1).length;
  const hasCompounding = Math.abs(contributions.synergy || 0) > 0.1 && Math.abs(contributions.tension || 0) > 0.1;
  
  if (nonZeroTerms >= 5 && hasCompounding) {
    return "high";
  } else if (nonZeroTerms >= 3 || hasCompounding) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Scale scenario impacts based on severity multiplier
 * @param {Object} metrics - Metrics object with contributions
 * @param {number} severity - 0.5 | 1.0 | 1.5
 * @returns {Object} - Scaled metrics with updated contributions
 */
export function scaleScenarioImpacts(metrics, severity) {
  const scaledMetrics = {};
  
  Object.keys(metrics).forEach(metricId => {
    const metric = metrics[metricId];
    const scaledContributions = {};
    
    // Scale all contribution types
    Object.keys(metric.contributions).forEach(contribType => {
      scaledContributions[contribType] = (metric.contributions[contribType] || 0) * severity;
    });
    
    // Recalculate delta based on scaled contributions
    const newDelta = Object.values(scaledContributions).reduce((sum, val) => sum + val, 0);
    
    scaledMetrics[metricId] = {
      ...metric,
      contributions: scaledContributions,
      delta: newDelta
    };
  });
  
  return scaledMetrics;
}

/**
 * Format delta as qualitative chip
 * @param {number} delta - The change value
 * @returns {Object} - { direction: 'up'|'down'|'flat', magnitude: 'small'|'medium'|'large' }
 */
export function formatDeltaAsChip(delta) {
  const absDelta = Math.abs(delta);
  
  let direction = 'flat';
  if (delta > 0.5) direction = 'up';
  else if (delta < -0.5) direction = 'down';
  
  let magnitude = 'small';
  if (absDelta >= 5) magnitude = 'large';
  else if (absDelta >= 2) magnitude = 'medium';
  
  return { direction, magnitude };
}

/**
 * Check if policies meet threshold for synergy/tension activation
 * @param {Array} policies - Array of policy IDs
 * @param {Object} rule - Rule object with threshold property
 * @returns {string|null} - 'Threshold met' | 'Almost active' | null
 */
export function thresholdBadge(policies, rule) {
  const threshold = rule.threshold || 35;
  const policyIntensities = policies.map(p => p.intensity || 0);
  const minIntensity = Math.min(...policyIntensities);
  const maxIntensity = Math.max(...policyIntensities);
  
  if (minIntensity >= threshold) {
    return 'Threshold met';
  } else if (maxIntensity >= threshold - 5 && minIntensity >= threshold - 10) {
    return 'Almost active';
  }
  
  return null;
}

/**
 * Generate near-miss alternatives for strategy classification
 * @param {Object} clusterScores - Current cluster scores
 * @returns {Array} - Array of alternative strategy descriptions
 */
export function getNearMissAlternatives(clusterScores) {
  const alternatives = [];
  const sortedClusters = Object.entries(clusterScores)
    .sort(([,a], [,b]) => b - a);
  
  if (sortedClusters.length >= 2) {
    const [first, second] = sortedClusters;
    const scoreDiff = first[1] - second[1];
    
    if (scoreDiff <= 10) { // Within 10% of each other
      const clusterNames = {
        governance: "Governance & Safety",
        capacity: "Infrastructure & Capacity", 
        culture: "Culture & Community"
      };
      
      alternatives.push(`Almost ${clusterNames[second[0]]} strategy`);
    }
  }
  
  return alternatives;
}

/**
 * Generate feedback mini-stories from current data
 * @param {Array} loops - Array of loop objects
 * @param {Object} metrics - Current metrics
 * @returns {Array} - Array of story strings
 */
export function generateFeedbackMiniStories(loops, metrics) {
  const stories = [];
  
  // Look for reinforcing loops
  const reinforcingLoops = loops.filter(loop => loop.type === 'reinforcing');
  if (reinforcingLoops.length > 0) {
    const loop = reinforcingLoops[0];
    stories.push(loop.summary || "Positive feedback loop: improvements in one area strengthen related capabilities.");
  }
  
  // Look for balancing loops
  const balancingLoops = loops.filter(loop => loop.type === 'balancing');
  if (balancingLoops.length > 0) {
    const loop = balancingLoops[0];
    stories.push(loop.summary || "Balancing mechanism: system adjusts to maintain stability across competing priorities.");
  }
  
  // Generate metric-specific stories
  if (metrics.AI_LITERACY > 60 && metrics.TEACHER_SATISFACTION > 60) {
    stories.push("Teachers with strong AI skills report higher job satisfaction, creating a positive cycle of professional growth.");
  }
  
  if (metrics.COMMUNITY_TRUST > 60 && metrics.DIGITAL_EQUITY > 60) {
    stories.push("High community trust enables more equitable access to AI tools, reinforcing both trust and equity outcomes.");
  }
  
  return stories.slice(0, 3); // Limit to 3 stories
}

/**
 * Generate delay hints for metric impacts
 * @param {string} metricId - The metric identifier
 * @returns {string} - Delay hint string
 */
export function getDelayHint(metricId) {
  const delayHints = {
    AI_LITERACY: "Most visible in 1-2 rounds",
    TEACHER_SATISFACTION: "Immediate impact, sustained over time",
    COMMUNITY_TRUST: "Builds gradually over 2-3 rounds",
    DIGITAL_EQUITY: "Infrastructure changes visible in 1-2 rounds",
    INNOVATION_INDEX: "Rapid early gains, then plateaus",
    BUDGET_STRAIN: "Immediate pressure, relief takes 2-3 rounds",
    EMPLOYMENT_IMPACT: "Long-term effects visible in 3-4 rounds",
    AI_VULNERABILITY_INDEX: "Security improvements show in 1-2 rounds"
  };
  
  return delayHints[metricId] || "Effects develop over time";
}

/**
 * Get assumptions panel data for workshop transparency
 * @returns {Object} - Assumptions object with categories and details
 */
export function getAssumptionsPanel() {
  return {
    intensityCurve: {
      description: "Smooth S-curve using tanh function prevents unrealistic jumps",
      formula: "tanh(k*(intensity-center)/50)",
      parameters: {
        governance: { k: 1.2, center: 50 },
        capacity: { k: 1.5, center: 50 },
        culture: { k: 1.0, center: 50 }
      }
    },
    metricCaps: {
      description: "Per-metric maximum change per tick ensures realistic annual bounds",
      caps: {
        AI_LITERACY: 8,
        TEACHER_SATISFACTION: 6,
        COMMUNITY_TRUST: 6,
        DIGITAL_EQUITY: 6,
        INNOVATION_INDEX: 7,
        AI_VULNERABILITY_INDEX: 10,
        BUDGET_STRAIN: 10,
        EMPLOYMENT_IMPACT: 7
      }
    },
    synergyGates: {
      description: "Synergies only activate when both policies ≥35 intensity",
      cap: "≤30% of combined base effect per metric per tick"
    },
    trustFeedback: {
      description: "AI-related policies benefit more when community trust is high",
      formula: "0.6 + 0.8×sigmoid((trust-50)/10)",
      affectedPolicies: ['AI-Integration', 'Data Analytics Capacity', 'Innovation Research & Pilots']
    },
    budgetThrottling: {
      description: "Cost-intensive policies reduced when budget strain >70",
      reduction: "20-40% based on policy cost intensity",
      affectedPolicies: ['Technology Infrastructure', 'Professional Development', 'Accessibility Standards', 'Data Analytics Capacity', 'Innovation Research & Pilots']
    },
    diminishingReturns: {
      description: "Stronger diminishing returns start at 60 points, emphasizing tradeoffs",
      formula: "max(0.1, 1.0 - (excess/25) * 0.9)"
    }
  };
}
