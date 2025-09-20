"use client";

import { motion } from "framer-motion";
import { useBuilds } from "@/hooks/useBuilds";
import { BuildCard } from "@/components/gallery-page/BuildCard";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { Loading, LoadingCard } from "@/components/ui/Loading";

export default function GalleryPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const { builds, loading, error, deleteBuild, copyPublicUrl } = useBuilds();

  // Show loading while auth is initializing
  if (authLoading) {
    return <Loading variant="spinner" size="lg" fullScreen text="Authenticating..." showText />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-full bg-[var(--bg-dark2)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="bg-[var(--bg-dark3)] rounded-lg shadow-md border border-[var(--bg-dark1)] p-8 max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-[var(--text1)] mb-4">Sign in Required</h1>
              <p className="text-[var(--text2)] mb-6">
                You need to be signed in to view your saved builds.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 bg-[var(--accent)] text-[var(--text1)] rounded-md hover:bg-[var(--highlight)] transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-full bg-[var(--bg-dark2)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--text1)]">My Builds</h1>
            <p className="text-[var(--text2)] mt-2">Your saved car configurations</p>
          </div>

          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[var(--bg-dark2)] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--text1)] mb-4">My Builds</h1>
            <div className="bg-[var(--bg-dark3)] border border-red-500/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-400">Failed to load builds: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-[var(--text1)] rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--bg-dark2)] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text1)]">My Builds</h1>
          <p className="text-[var(--text2)] mt-2">
            Your saved car configurations ({builds.length}{" "}
            {builds.length === 1 ? "build" : "builds"})
          </p>
        </div>

        {builds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-[var(--bg-dark3)] rounded-lg shadow-md border border-[var(--bg-dark1)] p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-[var(--text1)] mb-2">No builds yet</h3>
              <p className="text-[var(--text2)] mb-4">
                Create your first car build to see it here!
              </p>
              <a
                href="/mod"
                className="inline-block px-4 py-2 bg-[var(--accent)] text-[var(--text1)] rounded-md hover:bg-[var(--highlight)] transition-colors"
              >
                Create Build
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {builds.map((build, index) => (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <BuildCard build={build} onDelete={deleteBuild} onCopyUrl={copyPublicUrl} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
