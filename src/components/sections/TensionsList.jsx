import React from 'react';
import { Badge } from '../shared/Badge';

/**
 * TensionsList component for displaying policy tensions
 * @param {Object} props
 * @param {Array} props.tensions - Array of tension objects
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 */
export function TensionsList({ tensions = [], selectedPolicies = [] }) {
  const getPolicyName = (policyId) => {
    const policy = selectedPolicies.find(p => p.id === policyId);
    return policy ? policy.name : policyId;
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'High Tension';
      case 'medium': return 'Medium Tension';
      case 'low': return 'Low Tension';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Policy Tensions
        </h3>
        <Badge variant="error" size="sm">
          {tensions.length} detected
        </Badge>
      </div>
      
      {tensions.length > 0 ? (
        <div className="space-y-4">
          {tensions.map((tension, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-red-200 bg-red-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {tension.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {tension.policies.map(getPolicyName).join(' vs ')}
                  </p>
                </div>
                <Badge 
                  variant={getSeverityVariant(tension.severity)}
                  size="sm"
                >
                  {getSeverityText(tension.severity)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Affected metrics:</strong> {tension.metrics.join(', ')}
                </div>
                
                {/* Add specific explanation for each tension */}
                <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                  <p><strong>Why this happens:</strong> {tension.description}</p>
                </div>
                
                {tension.mitigation && (
                  <div className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="font-medium text-blue-800 mb-1">
                      💡 Mitigation Strategy:
                    </div>
                    <div className="text-blue-700">
                      {tension.mitigation}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                  <strong>Impact:</strong> This tension may reduce the effectiveness of both policies and create implementation challenges.
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚖️</span>
          </div>
          <p>No tensions detected</p>
          <p className="text-sm mt-1">Your current policy combination works well together</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Common tensions to watch for:</p>
            <p>• Student Protection vs Educator Autonomy</p>
            <p>• Data Analytics vs Student Protection</p>
            <p>• AI Integration vs Model Evaluation</p>
            <p>• Speed vs Safety (AI Integration + Protection)</p>
            <p>• Compliance without Capacity</p>
          </div>
        </div>
      )}
    </div>
  );
}
