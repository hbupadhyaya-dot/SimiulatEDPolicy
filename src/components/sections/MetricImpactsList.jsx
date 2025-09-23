import React from 'react';
import { IconUp } from '../shared/IconUp';
import { IconDown } from '../shared/IconDown';
import { Chip } from '../shared/Chip';
import { Badge } from '../shared/Badge';
import { Tooltip } from '../shared/Tooltip';
import { formatDeltaAsChip, computeConfidence, getDelayHint } from '../../utils/exploreImpactsUtils';

/**
 * MetricImpactsList component for displaying metric impacts with contribution breakdown
 * @param {Object} props
 * @param {Object} props.metrics - Metrics object with contributions
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 */
export function MetricImpactsList({ metrics = {}, selectedPolicies = [] }) {
  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'up': return <IconUp className="w-4 h-4 text-green-600" />;
      case 'down': return <IconDown className="w-4 h-4 text-red-600" />;
      default: return <span className="w-4 h-4 text-gray-400">↔</span>;
    }
  };

  const getMagnitudeVariant = (magnitude) => {
    switch (magnitude) {
      case 'large': return 'success';
      case 'medium': return 'warning';
      case 'small': return 'info';
      default: return 'neutral';
    }
  };

  const getMagnitudeText = (magnitude) => {
    switch (magnitude) {
      case 'large': return 'Large';
      case 'medium': return 'Medium';
      case 'small': return 'Small';
      default: return 'Unknown';
    }
  };

  const getConfidenceVariant = (confidence) => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'neutral';
    }
  };

  const getContributionTooltip = (type, value) => {
    const tooltips = {
      base: 'Base policy effect - the fundamental impact of this policy on the metric',
      intensity: 'Intensity multiplier - how much the policy intensity amplifies the base effect',
      prereq: 'Prerequisite effect - bonus/penalty based on whether required policies are active',
      synergy: 'Synergy bonus - additional effect when policies work well together',
      tension: 'Tension penalty - reduced effect when policies conflict with each other',
      trust: 'Trust multiplier - effect modified by community trust levels',
      budget: 'Budget effect - impact of budget constraints on policy effectiveness',
      diminish: 'Diminishing returns - reduced effectiveness as metric approaches limits'
    };
    
    return `${tooltips[type] || 'Unknown contribution type'}. Value: ${value.toFixed(2)}`;
  };

  const getMetricExplanation = (metricId, delta) => {
    const explanations = {
      AI_LITERACY: {
        positive: "Students are gaining better understanding of AI concepts, tools, and responsible use through enhanced curriculum and teacher training.",
        negative: "Students may be struggling with AI concepts due to insufficient training or resources, or curriculum gaps."
      },
      TEACHER_SATISFACTION: {
        positive: "Teachers feel more confident and supported in their AI integration efforts, likely due to training, resources, and clear policies.",
        negative: "Teachers may feel overwhelmed, unsupported, or constrained by AI policies, leading to decreased job satisfaction."
      },
      COMMUNITY_TRUST: {
        positive: "Community confidence in AI education initiatives is growing through transparency, safety measures, and positive outcomes.",
        negative: "Community concerns about AI in education may be increasing due to safety issues, lack of transparency, or negative experiences."
      },
      DIGITAL_EQUITY: {
        positive: "AI tools and opportunities are becoming more accessible to all students, regardless of background or ability.",
        negative: "AI access gaps may be widening, with some students having better opportunities than others."
      },
      INNOVATION_INDEX: {
        positive: "Schools are becoming more innovative in their approach to AI education, with experimentation and creative solutions.",
        negative: "Innovation may be constrained by safety concerns, budget limitations, or overly restrictive policies."
      },
      BUDGET_STRAIN: {
        positive: "Budget pressure is decreasing, possibly due to cost savings from AI efficiency or additional funding.",
        negative: "Budget strain is increasing due to expensive AI infrastructure, training costs, or multiple high-investment policies."
      },
      EMPLOYMENT_IMPACT: {
        positive: "Students are better prepared for AI-driven job markets through relevant skills and knowledge.",
        negative: "Students may lack the AI skills needed for future employment opportunities."
      },
      AI_VULNERABILITY_INDEX: {
        positive: "AI safety measures are working effectively, reducing risks and vulnerabilities in educational AI systems.",
        negative: "AI safety concerns are increasing, with potential risks from inadequate protection or evaluation measures."
      }
    };
    
    const explanation = explanations[metricId];
    if (!explanation) return "";
    
    return delta > 0 ? explanation.positive : explanation.negative;
  };

  const metricsWithImpacts = Object.entries(metrics).filter(([_, metric]) => 
    Math.abs(metric.delta || 0) > 0.1
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Metric Impacts
        </h3>
        <Badge variant="info" size="sm">
          {metricsWithImpacts.length} metrics changed
        </Badge>
      </div>
      
      {metricsWithImpacts.length > 0 ? (
        <div className="space-y-6">
          {metricsWithImpacts.map(([metricId, metric]) => {
            const deltaChip = formatDeltaAsChip(metric.delta);
            const confidence = computeConfidence(metric.contributions || {});
            const delayHint = getDelayHint(metricId);
            
            return (
              <div key={metricId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getDirectionIcon(deltaChip.direction)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {metric.label || metricId}
                      </h4>
                      <div className="text-sm text-gray-600">
                        Current: {metric.current?.toFixed(1) || 'N/A'} 
                        {metric.delta && (
                          <span className={`ml-2 ${metric.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({metric.delta > 0 ? '+' : ''}{metric.delta.toFixed(1)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getMagnitudeVariant(deltaChip.magnitude)}
                      size="sm"
                    >
                      {getMagnitudeText(deltaChip.magnitude)}
                    </Badge>
                    <Badge 
                      variant={getConfidenceVariant(confidence)}
                      size="sm"
                    >
                      {confidence} confidence
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Why it moved:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(metric.contributions || {}).map(([type, value]) => {
                      if (Math.abs(value) < 0.1) return null;
                      
                      return (
                        <Tooltip
                          key={type}
                          content={getContributionTooltip(type, value)}
                          position="top"
                        >
                          <Chip
                            type={type}
                            value={value}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Chip>
                        </Tooltip>
                      );
                    })}
                  </div>
                  
                  {/* Add specific explanation for the metric change */}
                  <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                    <strong>What this means:</strong> {getMetricExplanation(metricId, metric.delta)}
                  </div>
                </div>
                
                {delayHint && (
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    <strong>Timeline:</strong> {delayHint}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p>No metric changes detected</p>
          <p className="text-sm mt-1">Adjust policy intensities to see impacts</p>
        </div>
      )}
    </div>
  );
}
