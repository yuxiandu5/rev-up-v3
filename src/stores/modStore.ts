"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { 
  ModCategory, 
  Mod, 
  SelectedModsByCategory, 
  BuildData, 
  LoadingState,
} from "@/types/modTypes";

interface ModState {
  // Data
  categories: ModCategory[];
  mods: Mod[];
  currentCategory: string;
  selectedMods: SelectedModsByCategory;
  currentBuild: BuildData;
  
  // Loading states
  loading: LoadingState;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchModsForCategory: (categoryId: string, yearRangeId: string) => Promise<void>;
  setCurrentCategory: (category: string) => void;
  selectMod: (categoryId: string, mod: Mod) => void;
  deselectMod: (categoryId: string) => void;
  toggleMod: (categoryId: string, mod: Mod) => void;
  clearAllMods: () => void;
  
  // Build management
  setBuildName: (name: string) => void;
  setBuildNotes: (notes: string) => void;
  saveBuild: () => Promise<void>;
  loadBuild: (buildId: string) => Promise<void>;
  startNewBuild: () => void;
  
  // Calculations
  getTotalSpecsGained: () => {
    hpGain: number;
    torqueGain: number;
    handlingGain: number;
    zeroToHundredGain: number;
  };
  getTotalPrice: () => number;
  formatPrice: (price: number) => string;
}

const initialBuild: BuildData = {
  name: "",
  notes: "",
  selectedMods: {} as SelectedModsByCategory,
  isDraft: true,
};

export const useModStore = create<ModState>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      mods: [],
      currentCategory: "",
      selectedMods: {} as SelectedModsByCategory,
      currentBuild: initialBuild,
      loading: {
        categories: false,
        mods: false,
        saving: false,
        loading: false,
      },

      // API calls
      fetchCategories: async () => {
        set((state) => ({ 
          loading: { ...state.loading, categories: true } 
        }));
        
        try {
          const response = await fetch("/api/mod");
          if (!response.ok) throw new Error("Failed to fetch categories");
          
          const categories = await response.json();
          set({ categories });
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, categories: false } 
          }));
        }
      },

      fetchModsForCategory: async (categoryId: string, yearRangeId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, mods: true } 
        }));
        
        try {
          // Fetch compatible mods for this car
          const response = await fetch(`/api/mod/?categoryId=${categoryId}&yearRangeId=${yearRangeId}`);
          if (!response.ok) throw new Error("Failed to fetch compatible mods");

          const data = await response.json();
          set({ 
            mods: data || [],
          });
        } catch (error) {
          console.error("Error fetching mods:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, mods: false } 
          }));
        }
      },

      setCurrentCategory: (category: string) => {
        set({ currentCategory: category });
      },

      // Mod selection
      selectMod: (categoryId: string, mod: Mod) => {
        const { selectedMods, currentBuild } = get();
        
        const newSelectedMods = {
          ...selectedMods,
          [categoryId]: mod,
        };
        
        set({
          selectedMods: newSelectedMods,
          currentBuild: {
            ...currentBuild,
            selectedMods: newSelectedMods,
            isDraft: true, // Mark as draft when changes are made
          }
        });
      },

      deselectMod: (categoryId: string) => {
        const { selectedMods, currentBuild } = get();
        
        const newSelectedMods = { ...selectedMods };
        delete newSelectedMods[categoryId];
        
        // Check for dependent mods that need to be deselected
        const modsToDeselect: string[] = [];
        
        Object.entries(newSelectedMods).forEach(([catId, mod]) => {
          if (mod && mod.dependentOn && mod.dependentOn.length > 0) {
            // Check if this mod depends on the category we're deselecting
            const dependsOnDeselectedCategory = mod.dependentOn.some(
              (dependency) => dependency.prerequisiteCategory.id === categoryId
            );
            
            if (dependsOnDeselectedCategory) {
              modsToDeselect.push(catId);
            }
          }
        });
        
        // Remove all dependent mods
        modsToDeselect.forEach(catId => {
          delete newSelectedMods[catId];
        });
        
        set({
          selectedMods: newSelectedMods,
          currentBuild: {
            ...currentBuild,
            selectedMods: newSelectedMods,
            isDraft: true,
          }
        });
      },

      toggleMod: (categoryId: string, mod: Mod) => {
        const { selectedMods } = get();
        
        // If the mod is already selected in this category, deselect it
        if (selectedMods[categoryId]?.id === mod.id) {
          get().deselectMod(categoryId);
        } else {
          // Otherwise, select this mod
          get().selectMod(categoryId, mod);
        }
      },

      clearAllMods: () => {
        const { currentBuild } = get();
        
        set({
          selectedMods: {} as SelectedModsByCategory,
          currentBuild: {
            ...currentBuild,
            selectedMods: {} as SelectedModsByCategory,
            isDraft: true,
          }
        });
      },

      // Build management
      setBuildName: (name: string) => {
        const { currentBuild } = get();
        set({
          currentBuild: {
            ...currentBuild,
            name,
            isDraft: true,
          }
        });
      },

      setBuildNotes: (notes: string) => {
        const { currentBuild } = get();
        set({
          currentBuild: {
            ...currentBuild,
            notes,
            isDraft: true,
          }
        });
      },

      saveBuild: async () => {
        const { currentBuild } = get();
        
        set((state) => ({ 
          loading: { ...state.loading, saving: true } 
        }));
        
        try {
          const method = currentBuild.id ? "PUT" : "POST";
          const url = currentBuild.id ? `/api/builds/${currentBuild.id}` : "/api/builds";
          
          const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentBuild),
          });
          
          if (!response.ok) throw new Error("Failed to save build");
          
          const savedBuild = await response.json();
          set({
            currentBuild: {
              ...savedBuild,
              isDraft: false,
            }
          });
          
          return savedBuild;
        } catch (error) {
          console.error("Error saving build:", error);
          throw error;
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, saving: false } 
          }));
        }
      },

      loadBuild: async (buildId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, loading: true } 
        }));
        
        try {
          const response = await fetch(`/api/builds/${buildId}`);
          if (!response.ok) throw new Error("Failed to load build");
          
          const build = await response.json();
          set({
            currentBuild: build,
            selectedMods: build.selectedMods || {},
          });
        } catch (error) {
          console.error("Error loading build:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, loading: false } 
          }));
        }
      },

      startNewBuild: () => {
        set({
          currentBuild: { ...initialBuild },
          selectedMods: {} as SelectedModsByCategory,
        });
      },

      // Calculations
      getTotalSpecsGained: () => {
        const { selectedMods } = get();
        
        let totalHp = 0;
        let totalTorque = 0;
        let totalHandling = 0;
        let totalZeroToHundred = 0;
        
        Object.values(selectedMods).forEach((mod: Mod | undefined) => {
          if (mod && mod.compatibilities && mod.compatibilities.length > 0) {
            const compatibility = mod.compatibilities[0];
            totalHp += compatibility.hpGain || 0;
            totalTorque += compatibility.nmGain || 0;
            totalHandling += compatibility.handlingDelta || 0;
            totalZeroToHundred += compatibility.zeroToHundredDelta || 0;
          }
        });

        return {
          hpGain: totalHp,
          torqueGain: totalTorque,
          handlingGain: totalHandling,
          zeroToHundredGain: totalZeroToHundred,
        };
      },

      getTotalPrice: () => {
        const { selectedMods } = get();

        let totalPrice = 0;
        Object.values(selectedMods).forEach((mod: Mod | undefined) => {
          if (mod && mod.compatibilities && mod.compatibilities.length > 0) {
            const compatibility = mod.compatibilities[0];
            totalPrice += compatibility.price || 0;
          }
        });

        return totalPrice;
      },

      formatPrice: (price: number) => {
        return `$${price.toLocaleString()}`;
      },
    }),
    {
      name: "mod-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Persist build data and selections
        selectedMods: state.selectedMods,
        currentBuild: state.currentBuild,
      }),
    }
  )
);
