import React from 'react';
import { IconUp } from '../shared/IconUp';
import { Badge } from '../shared/Badge';

/**
 * BoostersSummary component for displaying top boosters
 * @param {Object} props
 * @param {Array} props.boosters - Array of booster objects
 */
export function BoostersRisksSummary({ boosters = [] }) {
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

  const getDirectionIcon = (direction) => {
    switch (direction) {
      case 'up': return <IconUp className="w-4 h-4" />;
      case 'down': return <IconDown className="w-4 h-4" />;
      default: return <span className="w-4 h-4 text-gray-400">↔</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Top Boosters */}
      <div className="flex items-center gap-2 mb-4">
        <IconUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Top 3 Boosters
        </h3>
      </div>
      
      {boosters.length > 0 ? (
        <div className="space-y-3">
          {boosters.slice(0, 3).map((booster, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                {getDirectionIcon(booster.direction)}
                <div>
                  <div className="font-medium text-gray-900">
                    {booster.metric}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booster.description}
                  </div>
                </div>
              </div>
              <Badge 
                variant={getMagnitudeVariant(booster.magnitude)}
                size="sm"
              >
                {getMagnitudeText(booster.magnitude)}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <IconUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No significant boosters detected</p>
        </div>
      )}
    </div>
  );
}
