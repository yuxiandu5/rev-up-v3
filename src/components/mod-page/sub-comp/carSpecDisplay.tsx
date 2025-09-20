import { CarSpecs } from "@/types/carTypes";
import ProgressBar from "./progressBar";

type CarSpecDisplayProps = {
  carSpecs: CarSpecs;
  specGained: {
    hpGain: number;
    torqueGain: number;
    handlingGain: number;
    zeroToHundredGain: number;
  };
};

export default function CarSpecDisplay({ carSpecs, specGained }: CarSpecDisplayProps) {
  // Calculate gained/lost values if modified specs are provided
  const modifiedSpecs = (original: number, modified: number) => {
    return modified + original;
  };

  // Define max values for each stat to calculate progress percentages
  const maxValues = {
    hp: 600, // Max horsepower for progress bar
    torque: 800, // Max torque (Nm)
    zeroToHundred: 12, // Max 0-100 time (seconds) - 1s = full bar, 12s = empty bar
    handling: 10, // Max handling score (1-10 scale)
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <header className="border-b border-[var(--bg-dark3)] pb-2">
        <h2 className="text-lg font-semibold text-[var(--text1)]">Performance Specs</h2>
      </header>

      <div className="flex flex-col gap-4">
        <ProgressBar
          label="Horsepower"
          value={modifiedSpecs(carSpecs.hp, specGained.hpGain)}
          maxValue={maxValues.hp}
          unit="hp"
          gainedLost={specGained.hpGain}
        />

        <ProgressBar
          label="Torque"
          value={modifiedSpecs(carSpecs.torque, specGained.torqueGain)}
          maxValue={maxValues.torque}
          unit="Nm"
          gainedLost={specGained.torqueGain}
        />

        {/* Note: For 0-100 time, lower is better, so we invert the progress */}
        <ProgressBar
          label="0-100 km/h"
          value={modifiedSpecs(carSpecs.zeroToHundred * 0.1, specGained.zeroToHundredGain * 0.1)}
          maxValue={maxValues.zeroToHundred}
          unit="s"
          gainedLost={specGained.zeroToHundredGain * 0.1}
          inverted={true}
        />

        <ProgressBar
          label="Handling"
          value={modifiedSpecs(carSpecs.handling, specGained.handlingGain)}
          maxValue={maxValues.handling}
          unit=""
          gainedLost={specGained.handlingGain}
        />
      </div>
    </div>
  );
}
