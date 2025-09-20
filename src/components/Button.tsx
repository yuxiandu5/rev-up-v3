import React from "react";
import { Loading } from "@/components/ui/Loading";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  // Base responsive classes
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  // Responsive size classes
  const sizeClasses = {
    sm: "text-sm sm:px-4 sm:py-2",
    md: "px-4 py-2 text-base sm:px-6 sm:py-3",
    lg: "px-6 py-3 text-lg sm:px-8 sm:py-4",
  };

  // Variant classes using your theme colors
  const variantClasses = {
    primary: "bg-[var(--bg-dark1)] text-[var(--highlight)] hover:bg-[var(--bg-dark3)]",
    secondary: "bg-[var(--bg-dark3)] text-[var(--text1)] hover:bg-[var(--bg-dark3)]/80",
  };

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "min-w-[80px] sm:min-w-[100px]";

  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`;

  const isDisabled = disabled || loading;

  return (
    <button type={type} className={buttonClasses} disabled={isDisabled} onClick={onClick}>
      {loading && (
        <div className="-ml-1 mr-2">
          <Loading variant="dots" size="xs" />
        </div>
      )}
      {children}
    </button>
  );
}
