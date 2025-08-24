import { Modification } from "@/types/modTypes";
import { formatPrice } from "@/utils/modCalculations";

type ModCardProps = {
  mod: Modification;
  isSelected?: boolean;
  onSelect: () => void;
}

export default function ModCard({mod, isSelected = false, onSelect}: ModCardProps) {

  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
        ${isSelected 
          ? "bg-[var(--bg-dark3)] border-[var(--highlight)]" 
          : "bg-[var(--bg-dark2)] border-[var(--bg-dark3)] hover:bg-[var(--bg-dark3)] hover:border-[var(--highlight)]"
        }
        cursor-pointer
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
            {formatPrice(mod.price)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text2)] leading-relaxed">
          {mod.description}
        </p>

        {/* Performance Changes */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 text-xs">
          {mod.specChanges.hp !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Horsepower:</span>
              <span className={mod.specChanges.hp > 0 ? "text-green-400" : "text-red-400"}>
                {mod.specChanges.hp > 0 ? "+" : ""}{mod.specChanges.hp} hp
              </span>
            </div>
          )}
          {mod.specChanges.torque !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Torque:</span>
              <span className={mod.specChanges.torque > 0 ? "text-green-400" : "text-red-400"}>
                {mod.specChanges.torque > 0 ? "+" : ""}{mod.specChanges.torque} Nm
              </span>
            </div>
          )}
          {mod.specChanges.zeroTo100 !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">0-100 km/h:</span>
              <span className={mod.specChanges.zeroTo100 < 0 ? "text-green-400" : "text-red-400"}>
                {mod.specChanges.zeroTo100 > 0 ? "+" : ""}{mod.specChanges.zeroTo100}s
              </span>
            </div>
          )}
          {mod.specChanges.handling !== 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--text2)]">Handling:</span>
              <span className={mod.specChanges.handling > 0 ? "text-green-400" : "text-red-400"}>
                {mod.specChanges.handling > 0 ? "+" : ""}{mod.specChanges.handling}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}