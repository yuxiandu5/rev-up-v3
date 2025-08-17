
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

export interface SelectedMods {
  [categoryName: string]: string | undefined; // Maps category name to selected mod id
}