import { BuildDetailDTO } from "@/types/DTO/dtos";
import { motion } from "framer-motion";
import CarDisplay from "../mod-page/sub-comp/carDisplay";
import CarSpecDisplay from "../mod-page/sub-comp/carSpecDisplay";
import ModCard from "../mod-page/sub-comp/modCard";
import { Loading } from "../ui/Loading";
import { CarSpecs, SelectedCar } from "@/types/carTypes";
import { Mod, ModCompatibility } from "@/types/modTypes";

export default function PublicCard({ build }: { build: BuildDetailDTO }) {
  console.log(build.specs.imageUrl);
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
  const getSpecGains = () => {
    // Calculate from detailed modifications
    return build.modifications.reduce(
      (acc, mod) => ({
        hpGain: acc.hpGain + mod.performance.hpGain,
        torqueGain: acc.torqueGain + mod.performance.torqueGain,
        handlingGain: acc.handlingGain + mod.performance.handlingDelta,
        zeroToHundredGain: acc.zeroToHundredGain + mod.performance.zeroToHundredDelta,
      }),
      { hpGain: 0, torqueGain: 0, handlingGain: 0, zeroToHundredGain: 0 }
    );
  };
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[var(--bg-dark3)] rounded-lg shadow-2xl border border-[var(--bg-dark1)] w-full max-w-[70vw] max-h-[90vh] overflow-hidden"
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

                {build.modifications.length === 0 ? (
                  <div className="flex justify-center py-8">
                    <Loading variant="spinner" text="Loading modifications..." showText />
                  </div>
                ) : build.modifications.length > 0 ? (
                  <div className="space-y-3 max-h-[58vh] overflow-y-auto scrollbar-hide">
                    {build.modifications.map((modificationDTO) => {
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
    </motion.div>
  );
}
