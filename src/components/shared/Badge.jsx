import React from 'react';

/**
 * Badge component for displaying status indicators
 * @param {Object} props
 * @param {string} props.variant - 'success' | 'warning' | 'error' | 'info' | 'neutral'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
export function Badge({ 
  variant = 'neutral', 
  size = 'md', 
  children, 
  className = '' 
}) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-live="polite"
    >
      {children}
    </span>
  );
}
