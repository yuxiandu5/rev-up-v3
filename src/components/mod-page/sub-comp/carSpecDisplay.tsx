import { CarSpecs } from "@/types/carTypes2";
import ProgressBar from "./progressBar";

type CarSpecDisplayProps = {
  carSpecs: CarSpecs;
  modifiedSpecs: CarSpecs | null;
}

export default function CarSpecDisplay({ carSpecs, modifiedSpecs }: CarSpecDisplayProps) {
  // Calculate gained/lost values if modified specs are provided
  const getGainedLost = (original: number, modified?: number) => {
    if (modified === undefined) return undefined;
    return modified - original;
  };

  // Define max values for each stat to calculate progress percentages
  const maxValues = {
    hp: 1000,        // Max horsepower for progress bar
    torque: 800,     // Max torque (Nm)
    zeroToHundred: 10,   // Max 0-100 time (seconds) - lower is better
    handling: 10     // Max handling score (1-10 scale)
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <header className="border-b border-[var(--bg-dark3)] pb-2">
        <h2 className="text-lg font-semibold text-[var(--text1)]">Performance Specs</h2>
      </header>
      
      <div className="flex flex-col gap-4">
        <ProgressBar
          label="Horsepower"
          value={modifiedSpecs?.hp || carSpecs.hp}
          maxValue={maxValues.hp}
          unit="hp"
          gainedLost={getGainedLost(carSpecs.hp, modifiedSpecs?.hp)}
        />
        
        <ProgressBar
          label="Torque"
          value={modifiedSpecs?.torque || carSpecs.torque}
          maxValue={maxValues.torque}
          unit="Nm"
          gainedLost={getGainedLost(carSpecs.torque, modifiedSpecs?.torque)}
        />
        
        {/* Note: For 0-100 time, lower is better, so we invert the progress */}
        <ProgressBar
          label="0-100 km/h"
          value={modifiedSpecs?.zeroToHundred || carSpecs.zeroToHundred * 0.1}
          maxValue={maxValues.zeroToHundred}
          unit="s"
          gainedLost={getGainedLost(carSpecs.zeroToHundred, modifiedSpecs?.zeroToHundred)}
          inverted={true}
        />
        
        <ProgressBar
          label="Handling"
          value={modifiedSpecs?.handling || carSpecs.handling}
          maxValue={maxValues.handling}
          unit=""
          gainedLost={getGainedLost(carSpecs.handling, modifiedSpecs?.handling)}
        />
      </div>
    </div>
  );
}