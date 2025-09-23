import React, { useState } from 'react';
import { Badge } from '../shared/Badge';
import { policyDefinitions } from '../../lib/policyData';

/**
 * StrategyCard component for displaying current strategy classification
 * @param {Object} props
 * @param {string} props.label - Strategy label
 * @param {string} props.rationale - Strategy rationale
 * @param {Object} props.clusterScores - Cluster scores object
 * @param {string} props.confidence - Confidence level
 * @param {Array} props.alternatives - Near-miss alternatives
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 */
export function StrategyCard({ 
  label, 
  rationale, 
  clusterScores, 
  confidence, 
  alternatives = [],
  selectedPolicies = []
}) {
  const [expandedCluster, setExpandedCluster] = useState(null);

  // Define policy clusters with their focus areas
  const clusterDefinitions = {
    governance: {
      name: 'Governance & Safety',
      description: 'Policies focused on regulatory compliance, student protection, and oversight mechanisms',
      policies: ['PROTECT_STD', 'MODEL_EVAL_STD', 'IMPACT_REP_STD', 'ACCESS_STD', 'INTEROP_STD', 'STATE_FED_PART'],
      focus: 'Ensuring safe, compliant, and transparent AI implementation'
    },
    capacity: {
      name: 'Infrastructure & Capacity',
      description: 'Policies focused on building technical capabilities, resources, and foundational infrastructure',
      policies: ['PD_FUNDS', 'INFRA_INVEST', 'DATA_ANALYTICS', 'AI_INTEGRATION', 'INNOV_SANDBOX'],
      focus: 'Building the technical foundation and human capacity for AI integration'
    },
    culture: {
      name: 'Culture & Community',
      description: 'Policies focused on stakeholder engagement, cultural change, and community involvement',
      policies: ['EDUC_AUTONOMY', 'DIGITAL_CITIZEN', 'COMM_INPUT', 'LOCAL_JOB_ALIGN'],
      focus: 'Fostering community trust, engagement, and cultural adaptation to AI'
    }
  };

  // Get policies in each cluster from selected policies (all policies are always selected, intensity varies 0-100)
  const getPoliciesInCluster = (clusterKey) => {
    const clusterPolicies = clusterDefinitions[clusterKey].policies;
    return selectedPolicies.filter(policy => 
      clusterPolicies.includes(policy.id)
    );
  };
  const getConfidenceVariant = (conf) => {
    switch (conf) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'neutral';
    }
  };

  const getConfidenceText = (conf) => {
    switch (conf) {
      case 'high': return 'High Confidence';
      case 'medium': return 'Medium Confidence';
      case 'low': return 'Low Confidence';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Current Strategy
          </h3>
          <h4 className="text-xl font-bold text-blue-600 mb-2">
            {label}
          </h4>
        </div>
        <Badge 
          variant={getConfidenceVariant(confidence)}
          size="sm"
        >
          {getConfidenceText(confidence)}
        </Badge>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h5 className="text-sm font-medium text-blue-800 mb-2">
          What this means:
        </h5>
        <p className="text-blue-700 text-sm leading-relaxed">
          {rationale}
        </p>
        <div className="mt-3 text-xs text-blue-600">
          <strong>Strategy Classification:</strong> Based on your selected policies and their implementation levels, 
          the system analyzes which strategic areas you're emphasizing most to determine your overall approach.
        </div>
      </div>
      
      {alternatives.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-600 mb-2">
            Near-miss alternatives:
          </h5>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((alt, index) => (
              <Badge key={index} variant="info" size="sm">
                {alt}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-sm font-medium text-gray-600">
            Policy cluster distribution (average implementation levels):
          </h5>
          <button
            onClick={() => setExpandedCluster(expandedCluster ? null : 'all')}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {expandedCluster ? 'Hide details' : 'Show policy details'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(clusterScores).map(([clusterKey, score]) => {
            const cluster = clusterDefinitions[clusterKey];
            const policiesInCluster = getPoliciesInCluster(clusterKey);
            const isExpanded = expandedCluster === 'all' || expandedCluster === clusterKey;
            
            return (
              <div key={clusterKey} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round(score)}%
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {cluster.name}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>
                
                {/* Cluster focus description */}
                <div className="text-xs text-gray-500 mb-2">
                  {cluster.focus}
                </div>
                
                {/* Policies count */}
                <div className="text-xs text-gray-500 mb-2">
                  {policiesInCluster.length} polic{policiesInCluster.length !== 1 ? 'ies' : 'y'} in cluster
                </div>
                
                {/* Expandable policy details */}
                {isExpanded && (
                  <div className="mt-3 text-left bg-gray-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Policies in this cluster:
                    </div>
                    {policiesInCluster.length > 0 ? (
                      <div className="space-y-1">
                        {policiesInCluster.map(policy => (
                          <div key={policy.id} className="text-xs text-gray-600">
                            <div className="font-medium">{policyDefinitions[policy.id]?.name || policy.name}</div>
                            <div className="text-gray-500">
                              Implementation: {policy.intensity || 0}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 italic">
                        No policies in this cluster
                      </div>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        Available policies:
                      </div>
                      <div className="text-xs text-gray-500">
                        {cluster.policies.map(policyId => 
                          policyDefinitions[policyId]?.name || policyId
                        ).join(', ')}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Click to expand individual cluster */}
                <button
                  onClick={() => setExpandedCluster(expandedCluster === clusterKey ? null : clusterKey)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  {expandedCluster === clusterKey ? 'Less' : 'More'}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Overall cluster explanation */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Understanding your cluster distribution:
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <strong>All Policies Counted:</strong> All policies are always "selected" - scores reflect average implementation levels (0-100%)</div>
            <div>• <strong>Governance & Safety:</strong> Higher scores indicate greater focus on compliance, protection, and oversight</div>
            <div>• <strong>Infrastructure & Capacity:</strong> Higher scores show greater emphasis on building technical capabilities and resources</div>
            <div>• <strong>Culture & Community:</strong> Higher scores reflect greater focus on stakeholder engagement and cultural change</div>
          </div>
        </div>
      </div>
    </div>
  );
}
