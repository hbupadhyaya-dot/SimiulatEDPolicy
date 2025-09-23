// Outcomes Panel Component - displays live outcome values

import React from 'react';
import { useOutcomes } from '../contexts/ScenarioContext';

const OutcomesPanel = () => {
  const outcomes = useOutcomes();

  const outcomeLabels = {
    aiLiteracy: 'AI Literacy',
    teacherSatisfaction: 'Teacher Satisfaction',
    employability: 'Employability',
    aiVulnerability: 'AI Vulnerability',
    communityTrust: 'Community Trust',
    innovationIndex: 'Innovation Index',
    digitalFairness: 'Digital Fairness',
    budgetStrain: 'Budget Strain',
  };

  const getValueColor = (value) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValueBackground = (value) => {
    if (value >= 70) return 'bg-green-100';
    if (value >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Current Outcomes
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(outcomes).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                {outcomeLabels[key]}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-sm font-semibold ${getValueBackground(value)} ${getValueColor(value)}`}>
                {Math.round(value)}
              </div>
              
              {/* Progress bar */}
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(outcomes).filter(v => v >= 70).length}
            </div>
            <div className="text-xs text-gray-500">Strong</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(outcomes).filter(v => v >= 50 && v < 70).length}
            </div>
            <div className="text-xs text-gray-500">Moderate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {Object.values(outcomes).filter(v => v < 50).length}
            </div>
            <div className="text-xs text-gray-500">Weak</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomesPanel;
