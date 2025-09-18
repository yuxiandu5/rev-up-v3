import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetry?: boolean;
  showNavigation?: boolean;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "Something went wrong",
  showRetry = true,
  showNavigation = false,
  className = "",
}: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen bg-[var(--bg-dark3)] flex items-center justify-center p-4 ${className}`}
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[var(--text1)] mb-2">
          {title}
        </h1>
        <p className="text-[var(--text2)] mb-6">{error}</p>
        
        <div className="space-y-3">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Try Again
            </button>
          )}
          
          {showNavigation && (
            <>
              <button
                onClick={() => router.push("/gallery")}
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Browse Gallery
              </button>
              <button
                    onClick={() => router.push("/")}
                className="w-full px-6 py-3 bg-[var(--bg-dark1)] text-[var(--text1)] rounded-lg hover:bg-[var(--bg-dark2)] transition-colors"
              >
                Go Home
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Specialized error components for common use cases
export function NotFoundError({ 
  item = "item", 
  itemId, 
  onRetry 
}: { 
  item?: string; 
  itemId?: string; 
  onRetry?: () => void; 
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-4"
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[var(--text1)] mb-2">
          {item.charAt(0).toUpperCase() + item.slice(1)} not found
        </h1>
        <p className="text-[var(--text2)] mb-6">
          The {item} {itemId && (
            <>
              with ID <code className="bg-[var(--bg-dark1)] px-2 py-1 rounded text-sm">{itemId}</code>
            </>
          )} could not be found or is not public.
        </p>
      </div>
    </motion.div>
  );
}

export function NoDataError({ 
  item = "data", 
  onRetry 
}: { 
  item?: string; 
  onRetry?: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[var(--bg-dark3)] flex items-center justify-center p-4"
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-2xl font-bold text-[var(--text1)] mb-2">
          No {item} found
        </h1>
        <p className="text-[var(--text2)] mb-6">
          This {item} appears to have no data available.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="Unable to connect to the server. Please check your internet connection and try again."
      title="Connection Error"
      onRetry={onRetry}
      showRetry={true}
      showNavigation={true}
    />
  );
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="The server encountered an error while processing your request. Please try again later."
      title="Server Error"
      onRetry={onRetry}
      showRetry={true}
      showNavigation={false}
    />
  );
}
