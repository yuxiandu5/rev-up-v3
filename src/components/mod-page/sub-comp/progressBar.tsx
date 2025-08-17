

type ProgressBarProps = {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
  gainedLost?: number; // positive for gained, negative for lost
  inverted?: boolean; // true for stats where lower is better (like 0-100 time)
};

export default function ProgressBar({ label, value, maxValue, unit = "", gainedLost, inverted = false }: ProgressBarProps) {
  // For inverted bars (like 0-100 time), we calculate percentage differently
  const percentage = inverted 
    ? Math.min(((maxValue - value) / maxValue) * 100, 100)
    : Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header with label and value */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text1)]">{label}</span>
        <div className="flex items-center gap-2">
          {gainedLost !== undefined && gainedLost !== 0 && (
            <span 
              className={`text-xs font-medium ${
                gainedLost > 0 
                  ? inverted ? 'text-red-400' : 'text-green-400' 
                  : inverted ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {gainedLost > 0 ? '+' : ''}
              {Number.isInteger(gainedLost) 
                ? gainedLost.toFixed(0) 
                : gainedLost.toFixed(1)}
            </span>
          )}
          <span className="text-sm font-bold text-[var(--text1)]">
            {value}{unit}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-[var(--bg-dark3)] rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}