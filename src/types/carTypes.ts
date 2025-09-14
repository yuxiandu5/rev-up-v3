// Types for the new API-based car selection system

export type Make = {
  id: string;
  name: string;
  slug: string;
};

export type Model = {
  id: string;
  name: string;
  slug: string;
};

export type Badge = {
  id: string;
  name: string;
  slug: string;
};

export type YearRange = {
  id: string;
  startYear: number;
  endYear: number | null;
  chassis: string | null;
  hp: number;
  torque: number;
  zeroToHundred: number;
  handling: number;
  url: string;
};

export type SelectedCar = {
  makeId: string;
  make: string;
  modelId: string;
  model: string;
  badgeId: string;
  badge: string;
  yearRangeId: string;
  yearRange: string;
};

export type CarSpecs = {
  hp: number;
  torque: number;
  zeroToHundred: number;
  handling: number;
  url?: string;
  chassis?: string | null;
};

export type LoadingState = {
  makes: boolean;
  models: boolean;
  badges: boolean;
  yearRanges: boolean;
};
