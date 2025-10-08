import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, onClick, type = 'button', isLoading = false, fullWidth = false, className = '' }) => {
  // Base classes for the button styling
  const baseClasses = `
    flex items-center justify-center px-8 py-3 font-semibold text-white text-base
    rounded-full shadow-lg transform transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    disabled:cursor-not-allowed disabled:scale-100
  `;

  // Classes for the button's active/gradient state
  const activeClasses = `
    bg-gradient-to-r from-purple-500 to-indigo-600 
    hover:from-purple-600 hover:to-indigo-700
    hover:scale-105
  `;
  
  // Classes for the button's disabled state
  const disabledClasses = `
    bg-gray-400
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${baseClasses}
        ${isLoading ? disabledClasses : activeClasses}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className} 
      `}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
