import React from 'react';
import { Badge } from '../shared/Badge';

/**
 * AssumptionsPanel component for displaying active assumptions and confidence levels
 * @param {Object} props
 * @param {Object} props.assumptions - Assumptions object
 * @param {Array} props.activeAssumptions - Array of active assumption keys
 * @param {Object} props.confidenceLevels - Confidence levels for different insights
 */
export function AssumptionsPanel({ 
  assumptions = {}, 
  activeAssumptions = [], 
  confidenceLevels = {} 
}) {
  const getConfidenceVariant = (confidence) => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'neutral';
    }
  };

  const getConfidenceText = (confidence) => {
    switch (confidence) {
      case 'high': return 'High Confidence';
      case 'medium': return 'Medium Confidence';
      case 'low': return 'Low Confidence';
      default: return 'Unknown';
    }
  };

  const assumptionCategories = {
    intensityCurve: {
      title: 'Intensity Curves',
      description: 'How policy intensity translates to impact',
      icon: '📈'
    },
    metricCaps: {
      title: 'Annual Limits',
      description: 'Maximum change per year for realism',
      icon: '⏱️'
    },
    synergyGates: {
      title: 'Synergy Activation',
      description: 'When policy combinations create bonus effects',
      icon: '🤝'
    },
    trustFeedback: {
      title: 'Trust Effects',
      description: 'How community trust amplifies AI policies',
      icon: '🏛️'
    },
    budgetThrottling: {
      title: 'Budget Constraints',
      description: 'How budget strain limits expensive policies',
      icon: '💰'
    },
    diminishingReturns: {
      title: 'Diminishing Returns',
      description: 'Reduced effectiveness at high metric levels',
      icon: '📉'
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Assumptions & Confidence
        </h3>
        <Badge variant="info" size="sm">
          {activeAssumptions.length} active
        </Badge>
      </div>
      
      <div className="space-y-4">
        {activeAssumptions.map((assumptionKey) => {
          const assumption = assumptions[assumptionKey];
          const category = assumptionCategories[assumptionKey];
          const confidence = confidenceLevels[assumptionKey] || 'medium';
          
          if (!assumption || !category) return null;
          
          return (
            <div key={assumptionKey} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {category.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={getConfidenceVariant(confidence)}
                  size="sm"
                >
                  {getConfidenceText(confidence)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  {assumption.description}
                </p>
                
                {/* Add specific explanations for each assumption category */}
                <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                  {assumptionKey === 'intensityCurve' && (
                    <p><strong>Why S-curve:</strong> Real-world policy implementation follows an S-curve pattern - slow initial adoption, rapid middle phase, then plateau as saturation approaches.</p>
                  )}
                  {assumptionKey === 'metricCaps' && (
                    <p><strong>Why caps matter:</strong> These limits prevent unrealistic overnight changes and ensure the model reflects real-world constraints on how quickly educational systems can transform.</p>
                  )}
                  {assumptionKey === 'synergyGates' && (
                    <p><strong>Why thresholds:</strong> Synergies only emerge when policies reach sufficient intensity to interact meaningfully - low-intensity policies don't create significant combined effects.</p>
                  )}
                  {assumptionKey === 'trustFeedback' && (
                    <p><strong>Why trust matters:</strong> AI policies require community buy-in to succeed. High trust amplifies positive effects, while low trust creates resistance and reduces effectiveness.</p>
                  )}
                  {assumptionKey === 'budgetThrottling' && (
                    <p><strong>Why budget limits:</strong> Expensive policies become less effective when resources are stretched thin, reflecting real-world prioritization and resource allocation challenges.</p>
                  )}
                  {assumptionKey === 'diminishingReturns' && (
                    <p><strong>Why diminishing returns:</strong> As metrics approach their natural limits, further improvement becomes increasingly difficult, reflecting real-world complexity and competing priorities.</p>
                  )}
                </div>
                
                {assumption.formula && (
                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      Formula:
                    </div>
                    <code className="text-sm text-gray-800 font-mono">
                      {assumption.formula}
                    </code>
                  </div>
                )}
                
                {assumption.parameters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(assumption.parameters).map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-gray-600">{key}:</span>
                        <span className="ml-1 text-gray-800">
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {assumption.affectedPolicies && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      Affected Policies:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {assumption.affectedPolicies.map((policy, index) => (
                        <Badge key={index} variant="neutral" size="sm">
                          {policy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {activeAssumptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔬</span>
          </div>
          <p>No active assumptions</p>
          <p className="text-sm mt-1">Assumptions become active as you select and adjust policies</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Key assumptions include:</p>
            <p>• S-curve intensity scaling</p>
            <p>• Annual metric change limits</p>
            <p>• Trust-based policy amplification</p>
            <p>• Budget constraint effects</p>
          </div>
        </div>
      )}
    </div>
  );
}
