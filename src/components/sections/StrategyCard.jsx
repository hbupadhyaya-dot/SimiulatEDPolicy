import React from 'react';
import { Badge } from '../shared/Badge';

/**
 * StrategyCard component for displaying current strategy classification
 * @param {Object} props
 * @param {string} props.label - Strategy label
 * @param {string} props.rationale - Strategy rationale
 * @param {Object} props.clusterScores - Cluster scores object
 * @param {string} props.confidence - Confidence level
 * @param {Array} props.alternatives - Near-miss alternatives
 */
export function StrategyCard({ 
  label, 
  rationale, 
  clusterScores, 
  confidence, 
  alternatives = [] 
}) {
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
      
      <p className="text-gray-700 mb-4 leading-relaxed">
        {rationale}
      </p>
      
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
        <h5 className="text-sm font-medium text-gray-600 mb-3">
          Policy cluster distribution:
        </h5>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(clusterScores).map(([cluster, score]) => {
            const clusterNames = {
              governance: 'Governance',
              capacity: 'Capacity', 
              culture: 'Culture'
            };
            
            return (
              <div key={cluster} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round(score)}%
                </div>
                <div className="text-xs text-gray-600">
                  {clusterNames[cluster] || cluster}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
