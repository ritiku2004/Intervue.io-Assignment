import React from 'react';

const Spinner = ({ isForButton = false }) => {
  // The spinner inside a button should be white.
  // The spinner for page loading should be the primary purple color.
  const spinnerColor = isForButton 
    ? 'border-white' 
    : 'border-primary';

  return (
    <div 
      className={`w-8 h-8 border-4 ${spinnerColor} rounded-full border-t-transparent animate-spin`}
    ></div>
  );
};

export default Spinner;
