import React from 'react';

/**
 * IconUp component for displaying upward trend indicators
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Icon size
 */
export function IconUp({ 
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
      aria-label="increasing"
      role="img"
    >
      <path
        d="M7 14l5-5 5 5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
