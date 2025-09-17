import { Mod, SelectedMods } from "@/types/modTypes";
import ModCategory from "./modCategory";
import ModCard from "./modCard";
import ModMenuCart from "./modMenuCart";
import { useModStore } from "@/stores/modStore";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCarStore } from "@/stores/carStore";
import { LoadingOverlay } from "@/components/ui/Loading";

type ModsMenuProps = {
  selectedMods: SelectedMods;
  selectMod: (categoryId: string, mod: Mod) => void;
  deselectMod: (categoryId: string) => void;
}

export default function ModsMenu({selectedMods}: ModsMenuProps) {

  const { getTotalPrice, setCurrentCategory, fetchCategories, categories, currentCategory, fetchModsForCategory, mods, toggleMod, formatPrice, loading } = useModStore();
  const { selectedCar } = useCarStore();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    fetchCategories();
    if (currentCategory !== "") {
      fetchModsForCategory(currentCategory, selectedCar.yearRangeId);
    }
  }, [currentCategory, selectedCar.yearRangeId]);

  const handleBackToCategories = () => {
    setCurrentCategory("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
        {/* Cart */}
        <ModMenuCart 
          className="hidden lg:block"
          totalPrice={totalPrice} 
          selectedMods={selectedMods}
        />
        {/* Content Area */}
        <div className="px-2 overflow-y-auto mt-4 scrollbar-hide md:px-0">
          {currentCategory === "" 
          ? (
            // Category Selection View
              <motion.div 
                key={"Categories"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-3"
              >
                <header className="mb-2 flex flex-row justify-between items-center lg:flex-col lg:items-start">
                  <h2 className="text-xl font-bold text-[var(--text1)]">
                    Categories
                  </h2>
                  <p className="hidden lg:block text-sm text-[var(--text2)]">
                    Choose a category to view available modifications
                  </p>
                  <span className="text-sm text-[var(--text2)] lg:hidden">
                    {Object.keys(selectedMods).length} ModsSelected
                  </span>
                  <span className="text-sm text-[var(--green)] font-bold lg:hidden">
                    {formatPrice(totalPrice)}
                  </span>
                </header>
                
                <LoadingOverlay 
                  show={loading.categories} 
                  variant="dots" 
                  text="Loading categories..."
                  showText
                >
                  <div className="flex flex-col gap-3">
                    {categories.map((category) => (
                      <ModCategory 
                        key={category.id}
                        category={category}
                        onSelect={() => setCurrentCategory(category.id)}
                        hasSelectedMod={Object.keys(selectedMods).includes(category.id)}
                        />
                    ))}
                  </div>
                </LoadingOverlay>
              </motion.div>
          ) 
          : (
            // Mod Selection View
              <motion.div 
                key={currentCategory}
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-3 h-full"
              >
                <header className="mb-2 sticky top-0 bg-[var(--bg-dark1)] z-10 pb-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text1)]">
                      {categories.find((category) => category.id === currentCategory)?.name}
                    </h2>
                    <button
                    onClick={handleBackToCategories}
                    className="
                      flex items-center gap-2 text-[var(--highlight)] hover:text-[var(--accent)] 
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
                
                <LoadingOverlay 
                  show={loading.mods} 
                  variant="spinner" 
                  text="Loading compatible mods..."
                  showText
                >
                  <div className="flex flex-col gap-3">
                    {mods.map((mod) => (
                      <ModCard 
                        key={mod.id}
                        mod={mod}
                        modSpec={mod.compatibilities?.[0]}
                        isSelected={selectedMods[currentCategory]?.id === mod.id}
                        onSelect={() => toggleMod(currentCategory, mod)}
                      />
                    ))}
                  </div>
                </LoadingOverlay>
              </motion.div>
            )}
        </div>
    </div>
  );
}
