import React from 'react';

/**
 * IconLoop component for displaying feedback loop indicators
 * @param {Object} props
 * @param {string} props.type - 'reinforcing' | 'balancing'
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Icon size
 */
export function IconLoop({ 
  type = 'reinforcing', 
  className = '', 
  size = 16 
}) {
  const isReinforcing = type === 'reinforcing';
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`${className}`}
      aria-label={`${type} loop`}
      role="img"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        fill={isReinforcing ? '#10B981' : '#F59E0B'}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      {isReinforcing ? (
        <path
          d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
          fill="none"
          stroke={isReinforcing ? '#10B981' : '#F59E0B'}
          strokeWidth="2"
        />
      ) : (
        <path
          d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
          fill="none"
          stroke={isReinforcing ? '#10B981' : '#F59E0B'}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
