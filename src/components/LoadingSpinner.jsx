import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Spinner Component
 * Displays an animated loading indicator
 */
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-600 border-t-[#649ef5] rounded-full animate-spin`}
        aria-hidden="true"
      ></div>
      {message && (
        <p className="mt-2 text-sm text-gray-400" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
};

export default LoadingSpinner;
