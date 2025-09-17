"use client";

import { motion } from "framer-motion";

// Simple className utility (avoiding external dependencies)
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// ============================================================================
// Loading Component Types
// ============================================================================

export interface LoadingProps {
  /** Loading variant */
  variant?: "spinner" | "dots" | "pulse" | "skeleton" | "bars" | "card" | "page";
  /** Size of the loading indicator */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Color theme */
  color?: "primary" | "secondary" | "accent" | "muted";
  /** Loading text */
  text?: string;
  /** Whether to show text */
  showText?: boolean;
  /** Custom className */
  className?: string;
  /** Full screen overlay */
  fullScreen?: boolean;
  /** Overlay background */
  overlay?: boolean;
  /** Custom spinner color (overrides color prop) */
  spinnerColor?: string;
}

// ============================================================================
// Size and Color Configurations
// ============================================================================

const sizeConfig = {
  xs: { size: "w-4 h-4", text: "text-xs", gap: "gap-1" },
  sm: { size: "w-6 h-6", text: "text-sm", gap: "gap-2" },
  md: { size: "w-8 h-8", text: "text-base", gap: "gap-3" },
  lg: { size: "w-12 h-12", text: "text-lg", gap: "gap-4" },
  xl: { size: "w-16 h-16", text: "text-xl", gap: "gap-4" },
};

const colorConfig = {
  primary: "text-[var(--accent)]",
  secondary: "text-[var(--text2)]",
  accent: "text-[var(--accent)]",
  muted: "text-[var(--text3)]",
};

// ============================================================================
// Individual Loading Variants
// ============================================================================

const SpinnerLoading = ({ size, color, spinnerColor }: { size: string; color: string; spinnerColor?: string }) => (
  <motion.div
    className={cn(
      "border-2 border-transparent rounded-full",
      size,
      spinnerColor ? "" : `border-t-current ${color}`
    )}
    style={spinnerColor ? { borderTopColor: spinnerColor } : {}}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const DotsLoading = ({ size, color }: { size: string; color: string }) => {
  const dotSize = size === "w-4 h-4" ? "w-1 h-1" : 
                 size === "w-6 h-6" ? "w-1.5 h-1.5" :
                 size === "w-8 h-8" ? "w-2 h-2" :
                 size === "w-12 h-12" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("rounded-full bg-current", dotSize, color)}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const PulseLoading = ({ size, color }: { size: string; color: string }) => (
  <motion.div
    className={cn("rounded-full bg-current", size, color)}
    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  />
);

const BarsLoading = ({ size, color }: { size: string; color: string }) => {
  const barWidth = size === "w-4 h-4" ? "w-0.5" : 
                  size === "w-6 h-6" ? "w-1" :
                  size === "w-8 h-8" ? "w-1" :
                  size === "w-12 h-12" ? "w-1.5" : "w-2";
  
  const barHeight = size === "w-4 h-4" ? "h-4" : 
                   size === "w-6 h-6" ? "h-6" :
                   size === "w-8 h-8" ? "h-8" :
                   size === "w-12 h-12" ? "h-12" : "h-16";

  return (
    <div className="flex items-end gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn("bg-current rounded-sm", barWidth, color)}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          style={{ height: barHeight }}
        />
      ))}
    </div>
  );
};

const SkeletonLoading = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-[var(--bg-dark2)] rounded", className)} />
);

// ============================================================================
// Specialized Loading Components
// ============================================================================

const CardSkeleton = () => (
  <div className="bg-[var(--bg-dark3)] rounded-lg shadow-md border border-[var(--bg-dark1)] overflow-hidden">
    <div className="p-4">
      <div className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-6 bg-[var(--bg-dark2)] rounded mb-2" />
        <div className="h-4 bg-[var(--bg-dark2)] rounded w-3/4 mb-4" />
        
        {/* Image skeleton */}
        <div className="h-48 bg-[var(--bg-dark1)] rounded-md mb-4" />
        
        {/* Stats skeleton */}
        <div className="flex gap-4">
          <div className="h-4 bg-[var(--bg-dark2)] rounded w-16" />
          <div className="h-4 bg-[var(--bg-dark2)] rounded w-16" />
          <div className="h-4 bg-[var(--bg-dark2)] rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="min-h-screen bg-[var(--bg-dark4)] p-6">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-[var(--bg-dark2)] rounded w-64 mb-4" />
          <div className="h-4 bg-[var(--bg-dark2)] rounded w-96" />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-[var(--bg-dark2)] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// Main Loading Component
// ============================================================================

export const Loading = ({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  showText = false,
  className,
  fullScreen = false,
  overlay = false,
  spinnerColor,
}: LoadingProps) => {
  const sizeProps = sizeConfig[size];
  const colorClass = colorConfig[color];

  // Specialized variants
  if (variant === "card") {
    return <CardSkeleton />;
  }

  if (variant === "page") {
    return <PageSkeleton />;
  }

  if (variant === "skeleton") {
    return <SkeletonLoading className={className} />;
  }

  // Standard loading indicator
  const loadingIndicator = (
    <div className={cn(
      "flex flex-col items-center justify-center",
      sizeProps.gap,
      className
    )}>
      {/* Loading animation */}
      <div className="flex items-center justify-center">
        {variant === "spinner" && (
          <SpinnerLoading size={sizeProps.size} color={colorClass} spinnerColor={spinnerColor} />
        )}
        {variant === "dots" && (
          <DotsLoading size={sizeProps.size} color={colorClass} />
        )}
        {variant === "pulse" && (
          <PulseLoading size={sizeProps.size} color={colorClass} />
        )}
        {variant === "bars" && (
          <BarsLoading size={sizeProps.size} color={colorClass} />
        )}
      </div>

      {/* Loading text */}
      {(showText || text) && (
        <motion.p
          className={cn(
            "font-medium",
            sizeProps.text,
            colorClass
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text || "Loading..."}
        </motion.p>
      )}
    </div>
  );

  // Full screen loading
  if (fullScreen) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        overlay ? "bg-black/50 backdrop-blur-sm" : "bg-[var(--bg-dark4)]"
      )}>
        {loadingIndicator}
      </div>
    );
  }

  return loadingIndicator;
};

// ============================================================================
// Specialized Loading Components (Exported)
// ============================================================================

export const LoadingSpinner = (props: Omit<LoadingProps, "variant">) => (
  <Loading {...props} variant="spinner" />
);

export const LoadingDots = (props: Omit<LoadingProps, "variant">) => (
  <Loading {...props} variant="dots" />
);

export const LoadingPulse = (props: Omit<LoadingProps, "variant">) => (
  <Loading {...props} variant="pulse" />
);

export const LoadingBars = (props: Omit<LoadingProps, "variant">) => (
  <Loading {...props} variant="bars" />
);

export const LoadingSkeleton = (props: Omit<LoadingProps, "variant">) => (
  <Loading {...props} variant="skeleton" />
);

export const LoadingCard = () => <Loading variant="card" />;

export const LoadingPage = () => <Loading variant="page" />;

// ============================================================================
// Loading Overlay Hook
// ============================================================================

export const LoadingOverlay = ({ 
  show, 
  children, 
  ...loadingProps 
}: { 
  show: boolean; 
  children: React.ReactNode; 
} & LoadingProps) => {
  if (!show) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
        <Loading {...loadingProps} />
      </div>
    </div>
  );
};

export default Loading;
