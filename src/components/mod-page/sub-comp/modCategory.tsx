import type { ModCategory } from "@/types/modTypes";
type ModCategoryProps = {
  category: ModCategory;
  onSelect: () => void;
  hasSelectedMod?: boolean;
}

export default function ModCategory({category, onSelect, hasSelectedMod = false}: ModCategoryProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-lg border text-left transition-all duration-200
      bg-[var(--bg-dark2)] border-[var(--bg-dark3)] hover:bg-[var(--bg-dark3)] hover:border-[var(--highlight)]
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-dark1)]
        cursor-pointer
        ${hasSelectedMod ? "bg-[var(--bg-dark3)] border-[var(--highlight)]" : ""}
      `}
      role="button"
      aria-pressed={hasSelectedMod}
      aria-label={`Select ${category.name} modifications`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-lg font-semibold text-[var(--text1)]">
            {category.name}
          </h3>
          <span className="text-sm text-[var(--text2)]">
            {/* {category.mods.length} modification{category.mods.length !== 1 ? "s" : ""} available */}
            {category.description}
          </span>
        </div>
        {hasSelectedMod && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-8 h-8 bg-[var(--green)]/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}