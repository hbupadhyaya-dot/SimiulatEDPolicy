// Header Scenario Selector Component

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScenarioStore } from '../contexts/ScenarioContext';
import { SCENARIOS, getScenarioImpactSummary } from '../lib/scenarios';

const HeaderScenarioSelect = () => {
  const { state, actions } = useScenarioStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);


  const handleScenarioChange = (event) => {
    const newScenario = event.target.value;
    actions.setScenario(newScenario);
  };

  const updateTooltipPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
    }
  }, [showTooltip]);

  const currentScenario = SCENARIOS[state.scenario];
  const impactSummary = getScenarioImpactSummary(state.scenario);

  return (
    <div className="flex items-center space-x-3">
      {/* Scenario Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <select
          id="scenario-select"
          value={state.scenario}
          onChange={handleScenarioChange}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {Object.values(SCENARIOS).map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Tooltip Portal */}
      {showTooltip && createPortal(
        <div 
          className="fixed z-[9999] w-80 p-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
        >
          <div className="font-semibold text-gray-800 mb-1">
            {currentScenario.label}
          </div>
          <div className="mb-2 text-gray-600">
            {currentScenario.description}
          </div>
          <div className="text-gray-700">
            {impactSummary}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default HeaderScenarioSelect;
