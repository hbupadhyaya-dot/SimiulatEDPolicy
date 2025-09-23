import React from 'react';

/**
 * Chip component for displaying contribution explanations
 * @param {Object} props
 * @param {string} props.type - 'base' | 'intensity' | 'prereq' | 'synergy' | 'tension' | 'trust' | 'budget' | 'diminish'
 * @param {number} props.value - Numeric value for context
 * @param {string} props.children - Chip content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.tooltip - Tooltip text
 */
export function Chip({ 
  type, 
  value, 
  children, 
  className = '', 
  tooltip 
}) {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border';
  
  const typeClasses = {
    base: 'bg-blue-50 text-blue-700 border-blue-200',
    intensity: 'bg-purple-50 text-purple-700 border-purple-200',
    prereq: 'bg-orange-50 text-orange-700 border-orange-200',
    synergy: 'bg-green-50 text-green-700 border-green-200',
    tension: 'bg-red-50 text-red-700 border-red-200',
    trust: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    budget: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    diminish: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  
  const formatValue = (val) => {
    if (Math.abs(val) < 0.1) return '';
    return ` (${val > 0 ? '+' : ''}${val.toFixed(1)})`;
  };
  
  return (
    <span 
      className={`${baseClasses} ${typeClasses[type] || typeClasses.base} ${className}`}
      title={tooltip}
      role="button"
      tabIndex={0}
      aria-label={`${children}${formatValue(value)}${tooltip ? `: ${tooltip}` : ''}`}
    >
      {children}
      {formatValue(value)}
    </span>
  );
}
