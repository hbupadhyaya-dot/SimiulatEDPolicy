import React from 'react';
import { Tooltip } from './shared/Tooltip';

/**
 * ExploreImpactsButton component for opening the Explore Impacts modal
 * @param {Object} props
 * @param {Array} props.selectedPolicies - Array of selected policy objects
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes
 */
export function ExploreImpactsButton({ 
  selectedPolicies = [], 
  onClick, 
  className = '' 
}) {
  const isDisabled = selectedPolicies.length < 3;
  const tooltipContent = isDisabled 
    ? "Pick at least three policies to analyze interactions"
    : "Explore how your policies interact and create impacts";

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors
          ${isDisabled 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }
          ${className}
        `}
        role="button"
        aria-disabled={isDisabled}
        aria-label={isDisabled ? tooltipContent : "Open Explore Impacts analysis"}
        tabIndex={isDisabled ? -1 : 0}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Explore Impacts
        {selectedPolicies.length >= 3 && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
            {selectedPolicies.length}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
