import { CarData, SelectedCar } from "@/types/carTypes";

type YearSelectorProps = {
  carData: CarData;
  selectedCar: SelectedCar;
  setSelectedCar: (car: SelectedCar) => void;
  disabled: boolean;
}

export default function YearSelector({carData, selectedCar, setSelectedCar, disabled}: YearSelectorProps) {

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar({...selectedCar, 
      yearRange: e.target.value,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-xs">
      <label htmlFor="yearSelector" className="text-[var(--text1)] text-sm font-medium mb-2">
        Year Range
      </label>
      <div className="relative">
        <select 
        name="yearSelector" 
        id="yearSelector" 
        disabled={disabled} 
        onChange={handleYearChange}
        value={selectedCar.yearRange}
        className="
          appearance-none bg-[var(--bg-dark1)] text-[var(--text1)] 
          border border-[var(--bg-dark3)] rounded-lg px-4 py-3 
          w-full min-h-[48px] cursor-pointer transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-[var(--text2)] hover:bg-[var(--bg-dark2)]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[var(--bg-dark3)]
          pr-10
        "
      >
        <option value="">Select Year</option>
        { selectedCar.make && selectedCar.model &&
          Object.keys(carData[selectedCar.make][selectedCar.model]).map((yearRange) => (  
            <option key={yearRange} value={yearRange} className="bg-[var(--bg-dark1)] text-[var(--text1)]">{yearRange}</option>
          ))
        }
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[var(--text2)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}