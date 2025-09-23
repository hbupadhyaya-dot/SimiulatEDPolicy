import React from 'react';
import { Badge } from '../shared/Badge';
import { thresholdBadge } from '../../utils/exploreImpactsUtils';

/**
 * SynergiesList component for displaying policy synergies
 * @param {Object} props
 * @param {Array} props.synergies - Array of synergy objects
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 */
export function SynergiesList({ synergies = [], selectedPolicies = [] }) {
  const getPolicyName = (policyId) => {
    const policy = selectedPolicies.find(p => p.id === policyId);
    return policy ? policy.name : policyId;
  };

  const getThresholdStatus = (synergy) => {
    const policyObjects = synergy.policies.map(policyId => 
      selectedPolicies.find(p => p.id === policyId) || { id: policyId, intensity: 0 }
    );
    return thresholdBadge(policyObjects, { threshold: synergy.threshold });
  };

  const getImpactBadge = (impact) => {
    if (impact === 'large') return { variant: 'success', text: 'Large' };
    if (impact === 'medium') return { variant: 'warning', text: 'Medium' };
    return { variant: 'info', text: 'Small' };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Policy Synergies
        </h3>
        <Badge variant="info" size="sm">
          {synergies.length} active
        </Badge>
      </div>
      
      {synergies.length > 0 ? (
        <div className="space-y-4">
          {synergies.map((synergy, index) => {
            const thresholdStatus = getThresholdStatus(synergy);
            const isActive = thresholdStatus === 'Threshold met';
            const isAlmostActive = thresholdStatus === 'Almost active';
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  isActive 
                    ? 'bg-green-50 border-green-200' 
                    : isAlmostActive 
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {synergy.label}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {synergy.policies.map(getPolicyName).join(' + ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {thresholdStatus && (
                      <Badge 
                        variant={isActive ? 'success' : isAlmostActive ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {thresholdStatus}
                      </Badge>
                    )}
                    {synergy.capped && (
                      <Badge variant="info" size="sm">
                        Capped
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <strong>Affected metrics:</strong> {synergy.metrics.join(', ')}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(synergy.rawImpact).map(([metric, impact]) => {
                      const badge = getImpactBadge(impact);
                      return (
                        <Badge 
                          key={metric} 
                          variant={badge.variant}
                          size="sm"
                        >
                          {metric}: {badge.text}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  {/* Add specific explanation for each synergy */}
                  <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                    <p><strong>Why this works:</strong> {synergy.description}</p>
                  </div>
                  
                  {synergy.capped && (
                    <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                      <strong>Note:</strong> Synergy effect capped at 30% of combined base effect to maintain realism.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🤝</span>
          </div>
          <p>No synergies detected</p>
          <p className="text-sm mt-1">Select policies with intensity ≥35% to see synergies</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Try combining policies like:</p>
            <p>• Professional Development + Educator Autonomy</p>
            <p>• Data Analytics + AI Integration</p>
            <p>• Student Protection + Model Evaluation</p>
            <p>• Community Input + Impact Reporting</p>
            <p>• AI Integration + Technology Infrastructure</p>
          </div>
        </div>
      )}
    </div>
  );
}
