"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BuildSummaryDTO, BuildDetailDTO } from "@/types/DTO/dtos";
import CarDisplay from "../mod-page/sub-comp/carDisplay";
import CarSpecDisplay from "../mod-page/sub-comp/carSpecDisplay";
import { CarSpecs, SelectedCar } from "@/types/carTypes";
import type { Mod, ModCompatibility } from "@/types/modTypes";
import ConfirmationDialog from "../ui/ConfirmationDialog";
import { useApiClient } from "@/hooks/useApiClient";
import { Loading } from "../ui/Loading";
import ModCard from "../mod-page/sub-comp/modCard";

// No need for these interfaces anymore - using DTOs directly

interface BuildCardProps {
  build: BuildSummaryDTO;
  onDelete: (buildId: string) => Promise<void>;
  onCopyUrl: (buildId: string) => string;
}

export const BuildCard = ({ build, onDelete, onCopyUrl }: BuildCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [buildDetail, setBuildDetail] = useState<BuildDetailDTO | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { apiCall } = useApiClient();

  // Transform DTO data for CarDisplay component
  const getCarDisplayData = (): { carSpecs: CarSpecs; selectedCar: SelectedCar } => {
    return {
      carSpecs: {
        hp: build.specs.hp,
        torque: build.specs.torque,
        zeroToHundred: build.specs.zeroToHundred,
        handling: build.specs.handling,
        url: build.specs.imageUrl,
      },
      selectedCar: {
        makeId: build.car.makeId,
        make: build.car.make,
        modelId: build.car.modelId,
        model: build.car.model,
        badgeId: build.car.badgeId,
        badge: build.car.badge,
        yearRangeId: build.car.yearRangeId,
        yearRange: build.car.endYear
          ? `${build.car.startYear}-${build.car.endYear}`
          : `${build.car.startYear}+`,
      },
    };
  };

  const { carSpecs, selectedCar } = getCarDisplayData();

  // Convert ModificationDTO to Mod and ModCompatibility for ModCard component
  const convertToModCardData = (
    modificationDTO: BuildDetailDTO["modifications"][0]
  ): { mod: Mod; modSpec: ModCompatibility } => {
    const mod: Mod = {
      id: modificationDTO.id,
      name: modificationDTO.name,
      slug: modificationDTO.name.toLowerCase().replace(/\s+/g, "-"),
      category: modificationDTO.category,
      description: modificationDTO.description || "",
      compatibilities: [], // Not needed for display
      dependentOn: [], // Not needed for display
    };

    const modSpec: ModCompatibility = {
      id: `${modificationDTO.id}-spec`,
      modId: modificationDTO.id,
      badgeId: build.car.badgeId,
      modelId: build.car.modelId,
      makeId: build.car.makeId,
      hpGain: modificationDTO.performance.hpGain,
      nmGain: modificationDTO.performance.torqueGain,
      handlingDelta: modificationDTO.performance.handlingDelta,
      zeroToHundredDelta: modificationDTO.performance.zeroToHundredDelta / 10, // Convert to seconds
      price: modificationDTO.price || 0,
      notes: modificationDTO.notes,
    };

    return { mod, modSpec };
  };

  // Fetch detailed build information when expanded
  const fetchBuildDetail = useCallback(async () => {
    if (buildDetail) return; // Already loaded

    try {
      setLoadingDetail(true);
      const response = await apiCall(`/api/builds/${build.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch build details: ${response.status}`);
      }

      const responseData = await response.json();
      setBuildDetail(responseData.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching build details:", error);
      // Continue without detailed data - graceful fallback
    } finally {
      setLoadingDetail(false);
    }
  }, [buildDetail, apiCall, build.id]);

  // Fetch details when expanded
  useEffect(() => {
    if (isExpanded && !buildDetail && !loadingDetail) {
      fetchBuildDetail();
    }
  }, [isExpanded, buildDetail, loadingDetail, fetchBuildDetail]);

  // Calculate spec gains for CarSpecDisplay
  const getSpecGains = () => {
    if (!buildDetail) {
      // Fallback calculation from summary data
      return {
        hpGain: build.performance.totalHp - carSpecs.hp,
        torqueGain: build.performance.totalTorque - carSpecs.torque,
        handlingGain: build.performance.totalHandling - carSpecs.handling,
        zeroToHundredGain: carSpecs.zeroToHundred - build.performance.zeroToHundred,
      };
    }

    // Calculate from detailed modifications
    return buildDetail.modifications.reduce(
      (acc, mod) => ({
        hpGain: acc.hpGain + mod.performance.hpGain,
        torqueGain: acc.torqueGain + mod.performance.torqueGain,
        handlingGain: acc.handlingGain + mod.performance.handlingDelta,
        zeroToHundredGain: acc.zeroToHundredGain + mod.performance.zeroToHundredDelta,
      }),
      { hpGain: 0, torqueGain: 0, handlingGain: 0, zeroToHundredGain: 0 }
    );
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(build.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete build:", error);
      alert("Failed to delete build. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleCopyUrl = () => {
    onCopyUrl(build.id);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  if (!isExpanded) {
    // Collapsed view - clickable card with car name and image
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => setIsExpanded(true)}
        className="bg-[var(--bg-dark3)] rounded-lg shadow-md border border-[var(--bg-dark1)] overflow-hidden cursor-pointer hover:bg-[var(--bg-dark2)] transition-colors"
      >
        {/* Car Name */}
        <div className="p-4 pb-2">
          <h3 className="text-lg font-semibold text-[var(--text1)]">
            {build.nickname || `${build.car.make} ${build.car.model}`}
          </h3>
          <p className="text-sm text-[var(--text2)]">
            {build.car.make} {build.car.model} {build.car.badge}{" "}
            {build.car.endYear
              ? `${build.car.startYear}-${build.car.endYear}`
              : `${build.car.startYear}+`}
          </p>
        </div>

        {/* Car Image using CarDisplay */}
        <div className="px-4 pb-4">
          <div className="bg-[var(--bg-dark1)] rounded-md p-4 border border-[var(--bg-dark3)] h-48">
            <CarDisplay carSpecs={carSpecs} selectedCar={selectedCar} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Expanded view - full screen overlay
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsExpanded(false);
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[var(--bg-dark3)] rounded-lg shadow-2xl border border-[var(--bg-dark1)] w-full max-w-[70vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with actions */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--bg-dark1)]">
          <div>
            <h3 className="text-2xl font-semibold text-[var(--text1)]">
              {build.nickname || `${build.car.make} ${build.car.model}`}
            </h3>
            <p className="text-[var(--text2)]">
              {build.car.make} {build.car.model} {build.car.badge}{" "}
              {build.car.endYear
                ? `${build.car.startYear}-${build.car.endYear}`
                : `${build.car.startYear}+`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              onClick={handleCopyUrl}
              className="p-3 text-[var(--text2)] hover:text-[var(--accent)] hover:bg-[var(--bg-dark1)] rounded-md transition-colors"
              title="Copy public URL"
            >
              {urlCopied ? (
                <svg
                  className="w-5 h-5 text-[var(--green)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              )}
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-3 text-[var(--text2)] hover:text-red-400 hover:bg-[var(--bg-dark1)] rounded-md transition-colors disabled:opacity-50"
              title="Delete build"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="p-3 text-[var(--text2)] hover:text-[var(--text1)] hover:bg-[var(--bg-dark1)] rounded-md transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Car Display and Specs */}
            <div className="flex flex-col gap-6">
              {/* Car Display */}
              <div className="bg-[var(--bg-dark1)] rounded-lg p-4 border border-[var(--bg-dark3)]">
                <h4 className="text-lg font-semibold text-[var(--text1)] mb-4">Vehicle</h4>
                <div className="h-64 bg-[var(--bg-dark2)] rounded-md p-4 border border-[var(--bg-dark3)]">
                  <CarDisplay carSpecs={carSpecs} selectedCar={selectedCar} />
                </div>
              </div>

              {/* Performance Specs with Progress Bars */}
              <div className="bg-[var(--bg-dark1)] rounded-lg p-4 border border-[var(--bg-dark3)]">
                <CarSpecDisplay carSpecs={carSpecs} specGained={getSpecGains()} />
              </div>
            </div>

            {/* Right Column - Modifications List */}
            <div className="flex flex-col gap-4">
              <div className="bg-[var(--bg-dark1)] rounded-lg p-4 border border-[var(--bg-dark3)]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-[var(--text1)]">
                    Modifications ({build.modsCount})
                  </h4>
                  <span className="text-green-400 font-semibold">
                    ${build.totalPrice.toLocaleString()}
                  </span>
                </div>

                {loadingDetail ? (
                  <div className="flex justify-center py-8">
                    <Loading variant="spinner" text="Loading modifications..." showText />
                  </div>
                ) : buildDetail?.modifications && buildDetail.modifications.length > 0 ? (
                  <div className="space-y-3 max-h-[58vh] overflow-y-auto scrollbar-hide">
                    {buildDetail.modifications.map((modificationDTO) => {
                      const { mod, modSpec } = convertToModCardData(modificationDTO);
                      return (
                        <ModCard
                          key={mod.id}
                          mod={mod}
                          modSpec={modSpec}
                          isSelected={false}
                          onSelect={() => {}} // No-op for display-only
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-[var(--text2)] py-8">
                    <p className="mb-2">No modifications found</p>
                    <p className="text-sm">This build appears to have no modifications applied.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Build"
        message={`Are you sure you want to delete "${build.nickname || `${build.car.make} ${build.car.model}`}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </motion.div>
  );
};
