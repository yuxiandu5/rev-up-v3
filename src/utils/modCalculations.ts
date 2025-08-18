import { CarSpecs } from "@/types/carTypes";
import { ModSpecChanges, Modification, SelectedMods } from "@/types/modTypes";
import { modData } from "@/data/modData";

/**
 * Applies spec changes from selected modifications to base car specs
 * @param carSpecs - Base car specifications
 * @param selectedMods - Object mapping category names to selected mod IDs
 * @returns Combined specifications with modifications applied
 */
export function applySpecChanges(carSpecs: CarSpecs, selectedMods: SelectedMods): CarSpecs {
  const modifiedSpecs = { ...carSpecs };

  // Apply changes from each selected modification
  Object.entries(selectedMods).forEach(([category, modId]) => {
    if (!modId) return;
    const categoryMods = modData[category];
    if (categoryMods) {
      const selectedMod = categoryMods.find(mod => mod.id === modId);
      if (selectedMod) {
        modifiedSpecs.hp += selectedMod.specChanges.hp;
        modifiedSpecs.torque += selectedMod.specChanges.torque;
        modifiedSpecs.zeroTo100 += selectedMod.specChanges.zeroTo100;
        modifiedSpecs.handling += selectedMod.specChanges.handling;
      }
    }
  });

  return modifiedSpecs;
}

/**
 * Calculates the cumulative spec changes from selected modifications
 * @param selectedMods - Object mapping category names to selected mod IDs
 * @returns Total spec changes from all selected mods
 */
export function calculateTotalSpecChanges(selectedMods: SelectedMods): ModSpecChanges {
  const totalChanges: ModSpecChanges = {
    hp: 0,
    torque: 0,
    zeroTo100: 0,
    handling: 0
  };

  Object.entries(selectedMods).forEach(([category, modId]) => {
    if (!modId) return;
    const categoryMods = modData[category];
    if (categoryMods) {
      const selectedMod = categoryMods.find(mod => mod.id === modId);
      if (selectedMod) {
        totalChanges.hp += selectedMod.specChanges.hp;
        totalChanges.torque += selectedMod.specChanges.torque;
        totalChanges.zeroTo100 += selectedMod.specChanges.zeroTo100;
        totalChanges.handling += selectedMod.specChanges.handling;
      }
    }
  });

  return totalChanges;
}

/**
 * Calculates the total price of selected modifications
 * @param selectedMods - Object mapping category names to selected mod IDs
 * @returns Total price of all selected modifications
 */
export function calculateTotalPrice(selectedMods: SelectedMods): number {
  let totalPrice = 0;

  Object.entries(selectedMods).forEach(([category, modId]) => {
    if (!modId) return;
    const categoryMods = modData[category];
    if (categoryMods) {
      const selectedMod = categoryMods.find(mod => mod.id === modId);
      if (selectedMod) {
        totalPrice += selectedMod.price;
      }
    }
  });

  return totalPrice;
}

/**
 * Gets the selected modification object for a given category
 * @param selectedMods - Object mapping category names to selected mod IDs
 * @param category - Category name to get the selected mod for
 * @returns Selected modification object or null if none selected
 */
export function getSelectedMod(selectedMods: SelectedMods, category: string): Modification | null {
  const modId = selectedMods[category];
  if (!modId) return null;

  const categoryMods = modData[category];
  if (!categoryMods) return null;

  return categoryMods.find(mod => mod.id === modId) || null;
}

/**
 * Formats price with currency symbol and thousands separator
 * @param price - Price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return (
    `$${price.toLocaleString()}`
  );
}
