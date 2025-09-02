"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Types for the mod store
type ModCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type Mod = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description?: string;
  price?: number;
  modCategoryId?: string;
};

type ModCompatibility = {
  id: string;
  modId: string;
  badgeId: string;
  modelId: string;
  makeId: string;
  yearStart?: number;
  yearEnd?: number;
  hpGain?: number;
  nmGain?: number;
  handlingDelta?: number;
  zeroToHundredDelta?: number;
  notes?: string;
};

type SelectedMods = {
  [categoryId: string]: string | undefined; // Maps category ID to selected mod ID
};

type BuildData = {
  id?: string;
  name: string;
  notes?: string;
  selectedMods: SelectedMods;
  isDraft: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type LoadingState = {
  categories: boolean;
  mods: boolean;
  compatibility: boolean;
  saving: boolean;
  loading: boolean;
};

interface ModState {
  // Data
  categories: ModCategory[];
  mods: Mod[];
  compatibleMods: ModCompatibility[];
  selectedMods: SelectedMods;
  currentBuild: BuildData;
  
  // Loading states
  loading: LoadingState;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchModsForCar: (badgeId: string) => Promise<void>;
  selectMod: (categoryId: string, mod: Mod) => void;
  deselectMod: (categoryId: string) => void;
  clearAllMods: () => void;
  
  // Build management
  setBuildName: (name: string) => void;
  setBuildNotes: (notes: string) => void;
  saveBuild: () => Promise<void>;
  loadBuild: (buildId: string) => Promise<void>;
  startNewBuild: () => void;
  
  // Calculations
  getTotalSpecs: () => {
    hp: number;
    torque: number;
    handling: number;
    zeroToHundred: number;
  };
  getTotalPrice: () => number;
  getSelectedModsForCategory: (categoryId: string) => Mod | null;
}

const initialBuild: BuildData = {
  name: "",
  notes: "",
  selectedMods: {},
  isDraft: true,
};

export const useModStore = create<ModState>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      mods: [],
      compatibleMods: [],
      selectedMods: {},
      currentBuild: initialBuild,
      loading: {
        categories: false,
        mods: false,
        compatibility: false,
        saving: false,
        loading: false,
      },

      // API calls
      fetchCategories: async () => {
        set((state) => ({ 
          loading: { ...state.loading, categories: true } 
        }));
        
        try {
          const response = await fetch("/api/mod-categories");
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

      fetchModsForCar: async (badgeId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, mods: true, compatibility: true } 
        }));
        
        try {
          // Fetch compatible mods for this car
          const response = await fetch(`/api/mods/compatible?badgeId=${badgeId}`);
          if (!response.ok) throw new Error("Failed to fetch compatible mods");
          
          const data = await response.json();
          set({ 
            mods: data.mods || [],
            compatibleMods: data.compatibilities || []
          });
        } catch (error) {
          console.error("Error fetching mods:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, mods: false, compatibility: false } 
          }));
        }
      },

      // Mod selection
      selectMod: (categoryId: string, mod: Mod) => {
        const { selectedMods, currentBuild } = get();
        
        const newSelectedMods = {
          ...selectedMods,
          [categoryId]: mod.id,
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
        
        set({
          selectedMods: newSelectedMods,
          currentBuild: {
            ...currentBuild,
            selectedMods: newSelectedMods,
            isDraft: true,
          }
        });
      },

      clearAllMods: () => {
        const { currentBuild } = get();
        
        set({
          selectedMods: {},
          currentBuild: {
            ...currentBuild,
            selectedMods: {},
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
          selectedMods: {},
        });
      },

      // Calculations
      getTotalSpecs: () => {
        const { selectedMods, compatibleMods } = get();
        
        let totalHp = 0;
        let totalTorque = 0;
        let totalHandling = 0;
        let totalZeroToHundred = 0;
        
        Object.values(selectedMods).forEach(modId => {
          if (modId) {
            const compatibility = compatibleMods.find(comp => comp.modId === modId);
            if (compatibility) {
              totalHp += compatibility.hpGain || 0;
              totalTorque += compatibility.nmGain || 0;
              totalHandling += compatibility.handlingDelta || 0;
              totalZeroToHundred += compatibility.zeroToHundredDelta || 0;
            }
          }
        });
        
        return {
          hp: totalHp,
          torque: totalTorque,
          handling: totalHandling,
          zeroToHundred: totalZeroToHundred,
        };
      },

      getTotalPrice: () => {
        const { selectedMods, mods } = get();
        
        return Object.values(selectedMods).reduce((total, modId) => {
          if (modId) {
            const mod = mods.find(m => m.id === modId);
            return total + (mod?.price || 0);
          }
          return total;
        }, 0);
      },

      getSelectedModsForCategory: (categoryId: string) => {
        const { selectedMods, mods } = get();
        const modId = selectedMods[categoryId];
        
        if (!modId) return null;
        
        return mods.find(mod => mod.id === modId) || null;
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
