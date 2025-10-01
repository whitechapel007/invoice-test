import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Spinner from "./Spinner"; // Import the Spinner component

// Define props for the Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({
  children,
  isLoading = false,
  variant = "primary",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={twMerge(
        // base styles
        "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-[40px]  transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",

        // variants
        variant === "primary" &&
          "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        variant === "secondary" &&
          "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
        variant === "danger" &&
          "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",

        // disabled
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",

        // custom overrides - now works without !important
        className
      )}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : children}
    </button>
  );
};

export default Button;
