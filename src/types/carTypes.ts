
export interface CarSpecs {
  image: string;
  hp: number;
  torque: number;
  zeroTo100: number;
  handling: number; 
}

export interface CarModel {
  [yearRange: string]: CarSpecs;
}

export interface CarMake {
  [model: string]: CarModel;
}

export interface CarData {
  [make: string]: CarMake;
}

export interface SelectedCar {
  make: string;
  model: string;
  yearRange: string;
}