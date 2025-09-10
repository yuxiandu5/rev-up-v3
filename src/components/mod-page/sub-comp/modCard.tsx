import type { Mod, ModCompatibility } from "@/types/modTypes";
import { useModStore } from "@/stores/modStore";
import { useEffect, useState } from "react";

type ModCardProps = {
  mod: Mod;
  modSpec?: ModCompatibility;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function ModCard({mod, modSpec, isSelected = false, onSelect}: ModCardProps) {
  const { selectedMods, formatPrice } = useModStore();

  const [prerequisitesMet, setPrerequisitesMet] = useState(false);

  const checkIfPrerequisitesMet = () => {
    if (!mod.dependentOn || mod.dependentOn.length === 0) {
      return true; // No prerequisites needed
    }

    const requiredCategories = mod.dependentOn.map(p => p.prerequisiteCategory.id);
    
    // Check if all required categories have selected mods
    return requiredCategories.every(categoryId => {
      const hasSelectedMod = Object.keys(selectedMods);
      return hasSelectedMod.includes(categoryId);
    });
  };

  useEffect(() => {
    setPrerequisitesMet(checkIfPrerequisitesMet());
  }, [selectedMods]);

  const isDisabled = prerequisitesMet === false && !isSelected;

  return (
    <button
      onClick={isDisabled ? undefined : onSelect}
      disabled={isDisabled}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
        ${isSelected 
          ? "bg-[var(--bg-dark3)] border-[var(--highlight)]" 
          : isDisabled
          ? "bg-[var(--bg-dark2)] border-[var(--bg-dark3)] opacity-50 cursor-not-allowed"
          : "bg-[var(--bg-dark2)] border-[var(--bg-dark3)] hover:bg-[var(--bg-dark3)] hover:border-[var(--highlight)] cursor-pointer"
        }
        ${!isDisabled && "active:scale-99"}
      `}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${mod.name} modification`}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-semibold text-[var(--text1)]">
            {mod.name}
          </h4>
          <span className="text-lg font-bold text-green-400">
            {formatPrice(modSpec?.price || 0)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text2)] leading-relaxed">
          {mod.description}
        </p>

        {/* Performance Changes */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 text-xs">
          {modSpec?.hpGain && modSpec.hpGain !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Horsepower:</span>
              <span className={modSpec.hpGain && modSpec.hpGain > 0 ? "text-green-400" : "text-red-400"}>
                {modSpec.hpGain && modSpec.hpGain > 0 ? "+" : ""}{modSpec.hpGain} hp
              </span>
            </div>
          )}
          {modSpec?.nmGain && modSpec.nmGain !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Torque:</span>
              <span className={modSpec.nmGain && modSpec.nmGain > 0 ? "text-green-400" : "text-red-400"}>
                {modSpec.nmGain && modSpec.nmGain > 0 ? "+" : ""}{modSpec.nmGain} Nm
              </span>
            </div>
          )}
          {modSpec?.zeroToHundredDelta && modSpec.zeroToHundredDelta !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">0-100 km/h:</span>
              <span className={modSpec.zeroToHundredDelta && modSpec.zeroToHundredDelta < 0 ? "text-green-400" : "text-red-400"}>
                {modSpec.zeroToHundredDelta && modSpec.zeroToHundredDelta > 0 ? "+" : ""}{(modSpec.zeroToHundredDelta * 0.1).toFixed(1)}s
              </span>
            </div>
          )}
          {modSpec?.handlingDelta && modSpec.handlingDelta !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Handling:</span>
              <span className={modSpec.handlingDelta && modSpec.handlingDelta > 0 ? "text-green-400" : "text-red-400"}>
                {modSpec.handlingDelta && modSpec.handlingDelta > 0 ? "+" : ""}{modSpec.handlingDelta}
              </span>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {mod.dependentOn && mod.dependentOn.length > 0 && (
          <div className="flex flex-col gap-2">
          <span className={prerequisitesMet ? "text-green-400" : "text-red-400"}>
            {prerequisitesMet ? "Prerequisites Met:" : "Prerequisites Required:"}
          </span>
          <span className="text-[var(--text1)]">
            {mod.dependentOn.map(p => p.prerequisiteCategory.name).join(", ")}
          </span>
        </div>
        )}
      </div>
    </button>
  );
}