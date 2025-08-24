import { CarSpecs } from "@/types/carTypes";

type CarSpecDisplayMobileProps = {
  carSpecs: CarSpecs;
  modifiedSpecs: CarSpecs;
}

export default function CarSpecDisplayMobile({ carSpecs, modifiedSpecs }: CarSpecDisplayMobileProps) {
  // Calculate gained/lost values if modified specs are provided
  const getGainedLost = (original: number, modified?: number) => {
    if (modified === undefined) return undefined;
    return modified - original;
  };

  // Helper function to format gain/lost display
  const formatGainLost = (gainedLost: number | undefined, inverted = false) => {
    if (gainedLost === undefined || gainedLost === 0) return null;
    
    const isPositive = gainedLost > 0;
    const colorClass = isPositive 
      ? inverted ? "text-red-400" : "text-green-400" 
      : inverted ? "text-green-400" : "text-red-400";
    
    return (
      <span className={`text-xs font-medium ml-1 ${colorClass}`}>
        ({isPositive ? "+" : ""}{Number.isInteger(gainedLost) ? gainedLost.toFixed(0) : gainedLost.toFixed(1)})
      </span>
    );
  };

  const specs = [
    {
      label: "HP",
      value: modifiedSpecs?.hp || carSpecs.hp,
      unit: "",
      gainedLost: getGainedLost(carSpecs.hp, modifiedSpecs?.hp),
      inverted: false
    },
    {
      label: "Torque",
      value: modifiedSpecs?.torque || carSpecs.torque,
      unit: "Nm",
      gainedLost: getGainedLost(carSpecs.torque, modifiedSpecs?.torque),
      inverted: false
    },
    {
      label: "0-100",
      value: modifiedSpecs?.zeroTo100 || carSpecs.zeroTo100,
      unit: "s",
      gainedLost: getGainedLost(carSpecs.zeroTo100, modifiedSpecs?.zeroTo100),
      inverted: true
    },
    {
      label: "Handling",
      value: modifiedSpecs?.handling || carSpecs.handling,
      unit: "",
      gainedLost: getGainedLost(carSpecs.handling, modifiedSpecs?.handling),
      inverted: false
    }
  ];

  return (
    <div className="bg-[var(--bg-dark1)] rounded-lg p-3 border border-[var(--bg-dark3)]">
      <div className="grid grid-cols-2 gap-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <span className="text-xs text-[var(--text2)] font-medium mb-1">
              {spec.label}
            </span>
            <div className="flex items-center">
              <span className="text-sm font-bold text-[var(--text1)]">
                {Number.isInteger(spec.value) ? spec.value.toFixed(0) : spec.value.toFixed(1)}
                {spec.unit}
              </span>
              {formatGainLost(spec.gainedLost, spec.inverted)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
