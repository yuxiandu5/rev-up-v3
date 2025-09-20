// Legacy types - keeping for backward compatibility
export interface ModSpecChanges {
  hp: number;
  torque: number;
  zeroTo100: number;
  handling: number;
}

export interface Modification {
  id: string;
  name: string;
  price: number;
  specChanges: ModSpecChanges;
  description: string;
}

export interface ModificationCategory {
  [categoryName: string]: Modification[];
}

// New types extracted from modStore
export type ModCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  mods: Mod[];
};

export type prerequisiteCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type dependentOn = {
  prerequisiteCategory: prerequisiteCategory;
};

export type Mod = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  compatibilities?: ModCompatibility[];
  dependentOn?: dependentOn[];
};

export type ModCompatibility = {
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
  price: number;
};

export type SelectedModsByCategory = {
  [categoryId: string]: Mod | undefined; // Maps category ID to selected mod ID
};

export interface SelectedMods {
  [categoryName: string]: Mod | undefined; // Maps category name to selected mod id
}

export type LoadingState = {
  categories: boolean;
  mods: boolean;
};
