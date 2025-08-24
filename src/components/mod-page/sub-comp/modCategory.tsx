import { Modification } from "@/types/modTypes";

type ModCategoryProps = {
  category: string;
  modData: Modification[];
  onSelect: () => void;
  isSelected?: boolean;
}

export default function ModCategory({category, modData, onSelect, isSelected = false}: ModCategoryProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
      bg-[var(--bg-dark2)] border-[var(--bg-dark3)] hover:bg-[var(--bg-dark3)] hover:border-[var(--highlight)]
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-dark1)]
        cursor-pointer
      `}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${category} modifications`}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[var(--text1)]">
          {category}
        </h3>
        <span className="text-sm text-[var(--text2)]">
          {modData.length} modification{modData.length !== 1 ? "s" : ""} available
        </span>
      </div>
    </button>
  );
}