import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
    />
  );
};

export default Input;