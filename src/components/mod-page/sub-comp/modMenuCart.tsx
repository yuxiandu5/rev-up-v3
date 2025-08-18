import { SelectedMods } from "@/types/modTypes";
import { AnimatedPrice } from "@/utils/animatedNumberProps";
import { formatPrice, getSelectedMod } from "@/utils/modCalculations";

type ModMenuCartProps = {
  totalPrice: number;
  selectedMods: SelectedMods;
  className?: string;
}

export default function ModMenuCart({totalPrice, selectedMods, className}: ModMenuCartProps) {
  const selectedModsList = Object.entries(selectedMods).map(([category]) => {
    const mod = getSelectedMod(selectedMods, category);
    return mod ? { category, mod } : null;
  }).filter(Boolean);

  const hasSelectedMods = selectedModsList.length > 0;

  return (
    <div className={`bg-[var(--bg-dark2)] rounded-lg p-4 border border-[var(--bg-dark3)] sticky top-0 z-10 ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[var(--text1)]">
            Modifications Cart
          </h3>
          <span className="text-lg font-bold text-green-400">
            <AnimatedPrice price={totalPrice} duration={0.5} />
          </span>
        </div>

        {/* Selected Mods Count */}
        <div className="text-sm text-[var(--text2)]">
          {hasSelectedMods 
            ? `${selectedModsList.length} modification${selectedModsList.length !== 1 ? 's' : ''} selected`
            : 'No modifications selected'
          }
        </div>
      </div>
    </div>
  );
}