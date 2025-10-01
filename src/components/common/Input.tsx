import React, { InputHTMLAttributes } from "react";

// Use InputHTMLAttributes for standard HTML input props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // You can add custom props here if needed, e.g., 'label', 'icon', etc.
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        appearance-none
        relative
        block
        w-full
        px-3
        py-2
        border
        border-gray-300
        placeholder-gray-500
        text-gray-900
        rounded-lg
        focus:outline-none
        focus:ring-blue-500
        focus:border-blue-500
        sm:text-sm
        transition duration-150 ease-in-out
        ${className}
      `}
    />
  );
};

export default Input;
