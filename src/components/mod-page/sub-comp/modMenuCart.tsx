import { SelectedMods } from "@/types/modTypes";
import { AnimatedPrice } from "@/utils/animatedNumberProps";

type ModMenuCartProps = {
  totalPrice: number;
  selectedMods: SelectedMods;
  className?: string;
};

export default function ModMenuCart({ totalPrice, selectedMods, className }: ModMenuCartProps) {
  const modList = Object.values(selectedMods);
  const hasSelectedMods = Object.keys(selectedMods).length > 0;

  return (
    <div
      className={`bg-[var(--bg-dark2)] rounded-lg p-4 border border-[var(--bg-dark3)] sticky top-0 z-10 ${className}`}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--text1)]">Modifications Cart</h3>
          <span className="text-lg font-bold text-green-400">
            <AnimatedPrice price={totalPrice} duration={0.5} />
          </span>
        </div>

        {/* Selected Mods Count */}
        <div className="text-sm text-[var(--text2)]">
          {hasSelectedMods
            ? `${modList.length} modification${modList.length !== 1 ? "s" : ""} selected`
            : "No modifications selected"}
        </div>
      </div>
    </div>
  );
}
