import React from 'react';

/**
 * IconDown component for displaying downward trend indicators
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Icon size
 */
export function IconDown({ 
  className = '', 
  size = 16 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className}`}
      aria-label="decreasing"
      role="img"
    >
      <path
        d="M17 10l-5 5-5-5"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
