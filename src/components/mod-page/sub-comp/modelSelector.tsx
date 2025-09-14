import { Model, SelectedCar } from "@/types/carTypes";

type ModelSelectorProps = {
  models: Model[];
  selectedCar: SelectedCar;
  selectModel: (model: Model) => void;
  disabled: boolean;
}

export default function ModelSelector({models, selectedCar, selectModel, disabled}: ModelSelectorProps) {
  return (
    <div className="flex flex-col w-full max-w-xs">
      <label htmlFor="modelSelector" className="text-[var(--text1)] text-sm font-medium mb-2">
        Model
      </label>
      <div className="relative">
        <select 
        name="modelSelector" 
        id="modelSelector" 
        disabled={disabled} 
        onChange={(e) => selectModel(models.find(model => model.name === e.target.value)!)}
        value={selectedCar.model}
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
        {selectedCar.modelId === "" && <option value="">Select Model</option>}
        {
          models.map((model) => (  
            <option key={model.id} value={model.name} className="bg-[var(--bg-dark1)] text-[var(--text1)]">{model.name}</option>  
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