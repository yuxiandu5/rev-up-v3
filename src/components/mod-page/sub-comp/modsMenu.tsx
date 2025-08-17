import { SelectedMods } from "@/types/modTypes";
import ModCategory from "./modCategory";
import { useState } from "react";
import { modData } from "@/data/modData";
import ModCard from "./modCard";
import ModMenuCart from "./modMenuCart";
import { calculateTotalPrice } from "@/utils/modCalculations";

type ModsMenuProps = {
  selectedMods: SelectedMods;
  setSelectedMods: (mods: SelectedMods) => void;
}

export default function ModsMenu({selectedMods, setSelectedMods}: ModsMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const totalPrice = calculateTotalPrice(selectedMods);

  const handleModSelect = (category: string, modId: string) => {
    const updatedMods = { ...selectedMods };
    if (updatedMods[category] === modId) {
      delete updatedMods[category];
    } else {
      updatedMods[category] = modId;
    }
    setSelectedMods(updatedMods);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Cart */}
      <ModMenuCart 
        totalPrice={totalPrice} 
        selectedMods={selectedMods}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 scrollbar-hide h-full">
        {selectedCategory === "" 
        ? (
          // Category Selection View
          <div className="flex flex-col gap-3">
            <header className="mb-2">
              <h2 className="text-xl font-bold text-[var(--text1)]">
                Modification Categories
              </h2>
              <p className="text-sm text-[var(--text2)]">
                Choose a category to view available modifications
              </p>
            </header>
            
            <div className="flex flex-col gap-3">
              {Object.entries(modData).map(([category, mods]) => (
                <ModCategory 
                  key={category}
                  category={category}
                  onSelect={() => handleCategorySelect(category)}
                  modData={mods}
                  isSelected={selectedCategory === category}
                />
              ))}
            </div>
          </div>
        ) 
        : (
          // Mod Selection View
          <div className="flex flex-col gap-3 h-full">
            <header className="mb-2 sticky top-0 bg-[var(--bg-dark1)] z-10 pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--text1)]">
                  {selectedCategory}
                </h2>
                <button
                onClick={handleBackToCategories}
                className="
                  flex items-center gap-2 text-blue-400 hover:text-blue-300 
                  transition-colors duration-200 text-sm font-medium mb-2
                  rounded px-1 py-1
                  cursor-pointer
                "
                aria-label="Back to categories"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              </div>
              <p className="text-sm text-[var(--text2)]">
                Select one modification from this category
              </p>
            </header>
            
            <div className="flex flex-col gap-3">
              {modData[selectedCategory]?.map((mod) => (
                <ModCard 
                  key={mod.id}
                  mod={mod}
                  isSelected={selectedMods[selectedCategory] === mod.id}
                  onSelect={() => handleModSelect(selectedCategory, mod.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
