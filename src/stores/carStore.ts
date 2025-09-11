"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Make, Model, Badge, YearRange, SelectedCar, CarSpecs, LoadingState } from "@/types/carTypes2";

// Import mod store to clear mods when car changes
let clearModsCallback: (() => void) | null = null;

export const setModClearCallback = (callback: () => void) => {
  clearModsCallback = callback;
};

interface CarState {
  // Data
  makes: Make[];
  models: Model[];
  badges: Badge[];
  yearRanges: YearRange[];
  selectedCar: SelectedCar;
  carSpecs: CarSpecs;
  
  // Loading states
  loading: LoadingState;
  
  // Actions
  fetchMakes: () => Promise<void>;
  fetchModels: (makeId: string) => Promise<void>;
  fetchBadges: (modelId: string) => Promise<void>;
  fetchYearRanges: (badgeId: string) => Promise<void>;
  selectMake: (make: Make) => void;
  selectModel: (model: Model) => void;
  selectBadge: (badge: Badge) => void;
  selectYearRange: (yearRange: YearRange) => void;
  clearDependentData: (level: "models" | "badges" | "yearRanges") => void;
}

const initialSelectedCar: SelectedCar = {
  makeId: "",
  make: "",
  modelId: "",
  model: "",
  badgeId: "",
  badge: "",
  yearRangeId: "",
  yearRange: "",
};

const initialCarSpecs: CarSpecs = {
  url: "",
  hp: 0,
  torque: 0,
  zeroToHundred: 0,
  handling: 0,
};

export const useCarStore = create<CarState>()(
  persist(
    (set, get) => ({
      // Initial state
      makes: [],
      models: [],
      badges: [],
      yearRanges: [],
      selectedCar: initialSelectedCar,
      carSpecs: initialCarSpecs,
      loading: {
        makes: false,
        models: false,
        badges: false,
        yearRanges: false,
      },

      // API calls
      fetchMakes: async () => {
        set((state) => ({ 
          loading: { ...state.loading, makes: true } 
        }));
        
        try {
          const response = await fetch("/api/car");
          if (!response.ok) throw new Error("Failed to fetch makes");
          
          const makes = await response.json();
          set({ makes });
        } catch (error) {
          console.error("Error fetching makes:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, makes: false } 
          }));
        }
      },

      fetchModels: async (makeId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, models: true } 
        }));
        
        try {
          const response = await fetch(`/api/car?makeId=${makeId}`);
          if (!response.ok) throw new Error("Failed to fetch models");
          
          const models = await response.json();
          set({ models });
        } catch (error) {
          console.error("Error fetching models:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, models: false } 
          }));
        }
      },

      fetchBadges: async (modelId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, badges: true } 
        }));
        
        try {
          const response = await fetch(`/api/car?modelId=${modelId}`);
          if (!response.ok) throw new Error("Failed to fetch badges");
          
          const badges = await response.json();
          set({ badges });
        } catch (error) {
          console.error("Error fetching badges:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, badges: false } 
          }));
        }
      },

      fetchYearRanges: async (badgeId: string) => {
        set((state) => ({ 
          loading: { ...state.loading, yearRanges: true } 
        }));
        
        try {
          const response = await fetch(`/api/car?badgeId=${badgeId}`);
          if (!response.ok) throw new Error("Failed to fetch year ranges");
          
          const yearRanges = await response.json();
          set({ yearRanges });
        } catch (error) {
          console.error("Error fetching year ranges:", error);
        } finally {
          set((state) => ({ 
            loading: { ...state.loading, yearRanges: false } 
          }));
        }
      },

      // Selection actions
      selectMake: (make: Make) => {
        const { selectedCar, clearDependentData, fetchModels } = get();
        
        set({
          selectedCar: {
            ...selectedCar,
            makeId: make.id,
            make: make.name,
            // Clear dependent selections
            modelId: "",
            model: "",
            badgeId: "",
            badge: "",
            yearRangeId: "",
            yearRange: "",
          },
          carSpecs: initialCarSpecs, // Clear specs when make changes
        });
        
        // Clear all selected mods when car changes
        if (clearModsCallback) {
          clearModsCallback();
        }
        
        clearDependentData("models");
        fetchModels(make.id);
      },

      selectModel: (model: Model) => {
        const { selectedCar, clearDependentData, fetchBadges } = get();
        
        set({
          selectedCar: {
            ...selectedCar,
            modelId: model.id,
            model: model.name,
            // Clear dependent selections
            badgeId: "",
            badge: "",
            yearRangeId: "",
            yearRange: "",
          },
          carSpecs: initialCarSpecs, // Clear specs when model changes
        });
        
        // Clear all selected mods when car changes
        if (clearModsCallback) {
          clearModsCallback();
        }
        
        clearDependentData("badges");
        fetchBadges(model.id);
      },

      selectBadge: (badge: Badge) => {
        const { selectedCar, clearDependentData, fetchYearRanges } = get();
        
        set({
          selectedCar: {
            ...selectedCar,
            badgeId: badge.id,
            badge: badge.name,
            // Clear dependent selections
            yearRangeId: "",
            yearRange: "",
          },
          carSpecs: initialCarSpecs, // Clear specs when badge changes
        });
        
        // Clear all selected mods when car changes
        if (clearModsCallback) {
          clearModsCallback();
        }
        
        clearDependentData("yearRanges");
        fetchYearRanges(badge.id);
      },

      selectYearRange: (yearRange: YearRange) => {
        const { selectedCar } = get();
        
        const yearRangeDisplay = yearRange.endYear 
          ? `${yearRange.startYear}-${yearRange.endYear}`
          : `${yearRange.startYear}-Present`;

        const carSpecs: CarSpecs = {
          hp: yearRange.hp,
          torque: yearRange.torque,
          zeroToHundred: yearRange.zeroToHundred,
          handling: yearRange.handling,
          url: yearRange.url,
          chassis: yearRange.chassis,
        };
        
        // Clear all selected mods when car changes
        if (clearModsCallback) {
          clearModsCallback();
        }
          
        set({
          selectedCar: {
            ...selectedCar,
            yearRangeId: yearRange.id,
            yearRange: yearRangeDisplay,
          },
          carSpecs: carSpecs,
        });
      },

      clearDependentData: (level: "models" | "badges" | "yearRanges") => {
        if (level === "models") {
          set({ models: [], badges: [], yearRanges: [] });
        } else if (level === "badges") {
          set({ badges: [], yearRanges: [] });
        } else if (level === "yearRanges") {
          set({ yearRanges: [] });
        }
      },

    }),
    {
      name: "car-storage",
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage like your current setup
      partialize: (state) => ({
        // Only persist selectedCar data and specs, not API data or loading states
        selectedCar: state.selectedCar,
        carSpecs: state.carSpecs,
      }),
    }
  )
);
