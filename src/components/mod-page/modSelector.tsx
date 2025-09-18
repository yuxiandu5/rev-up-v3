import { useState } from "react";
import { CarSpecs, SelectedCar } from "@/types/carTypes";
import { ArrowLeftIcon, Save, X } from "lucide-react";
import CarDisplay from "./sub-comp/carDisplay";
import Button from "../Button";
import ModsMenu from "./sub-comp/modsMenu";
import CarSpecDisplay from "./sub-comp/carSpecDisplay";
import CarSpecDisplayMobile from "./sub-comp/carSpecDisplayMobile";
import SaveBuildDialog from "../gallery-page/SaveBuildDialog";
import { useModStore } from "@/stores/modStore";
import { useAuthStore } from "@/stores/authStore";
import { useApiClient } from "@/hooks/useApiClient";

type ModSelectorProps = {
  carSpecs: CarSpecs;
  selectedCar: SelectedCar;
  setPhase: (phase: string) => void;
}

export default function ModSelector({carSpecs, selectedCar, setPhase}: ModSelectorProps) {
  const { selectedMods, selectMod, deselectMod, clearAllMods, getTotalSpecsGained, setCurrentCategory } = useModStore();
  const {user} = useAuthStore();
  const { apiCall } = useApiClient();
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const buildData = {
    selectedCar,
    baseSpecs: carSpecs,
    selectedMods,
    nickname: "",
    notes: "",
  };

  const handleSave = async (nickname: string, notes: string) => {
    const finalBuildData = {
      ...buildData,
      nickname,
      notes,
    };

    const response = await apiCall("/api/builds", {
      method: "POST",
      body: JSON.stringify(finalBuildData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save build");
    }
  };

  return (
    <section 
      className="
        flex flex-col gap-2 md:gap-3 lg:gap-4 
        w-full h-full max-h-screen   
        p-2 md:p-4 lg:p-6
        bg-[var(--bg-dark2)]
      "
      role="main"
      aria-label="Vehicle modification interface"
    >

      {/* Vehicle Header */}
      <header 
        className="
          flex items-center justify-center
          text-center
          py-2
          relative
          border-b border-[var(--bg-dark3)]
        "
      >
        <Button 
          className="
            flex items-center gap-0 lg:gap-2 
            transition-all duration-200 
            absolute top-8 left-0 lg:top-4 lg:left-4
            hover:shadow-lg
            w-6 h-6 lg:w-auto lg:h-auto p-0.5 lg:px-3 lg:py-1.5 min-w-0
          " 
          onClick={() => {
            setPhase("car-selecting");
            setCurrentCategory("");
          }} 
          variant="secondary"
          size="sm"
          aria-label="Return to car selection page"
        >
          <ArrowLeftIcon className="w-3 h-3 lg:w-4 lg:h-4 text-[var(--text1)]" aria-hidden="true" />
          <span className="hidden lg:inline text-sm text-[var(--text1)] font-medium">
            Back to Car Selection
          </span>
        </Button>
        <div>
          <h1 
            className="
              text-lg md:text-xl lg:text-2xl 
              font-bold 
              text-[var(--text1)]
              leading-tight
            "
            id="vehicle-title"
          >
            {selectedCar.make} {selectedCar.model} {selectedCar.badge}
          </h1>
          <span
            className="
              opacity-0 lg:opacity-100 lg:block
              text-xs md:text-sm 
              text-[var(--text2)]
              font-medium
            "
            aria-describedby="vehicle-title"
          >
            {selectedCar.yearRange}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 absolute right-0 bottom-2 lg:bottom-4">
          <Button 
            variant="secondary" size="sm" 
            className={"min-h-6"} 
            disabled={!user || Object.keys(selectedMods).length === 0}
            onClick={() => setIsDialogOpen(true)}>
            <Save className="w-3 h-3 lg:hidden text-[var(--text1)] mr-1" aria-hidden="true" />
            <span className="hidden lg:block">Save</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => {clearAllMods();}} className="min-h-6">
            <X className="w-3 h-3 lg:hidden text-[var(--text1)] mr-1" aria-hidden="true" />
            <span className="hidden lg:block">Discard</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <section 
        className="
          flex flex-col lg:flex-row 
          gap-2 md:gap-4 lg:gap-6 
          flex-1 min-h-0
          items-start lg:items-stretch
          justify-center
          w-full
          overflow-y-auto
        "
        aria-labelledby="vehicle-title"
      >
        {/* Vehicle Display and Specs */}
        <div 
          className="
            hidden md:flex
            flex-col gap-2 md:gap-3
            w-full lg:w-2/3
            bg-[var(--bg-dark1)]
            rounded-lg
            p-2 md:p-3 lg:p-4
            border border-[var(--bg-dark3)]
            shadow-lg
            min-h-75 lg:flex-2
            overflow-y-auto scrollbar-hide
          "
          role="region"
          aria-label="Vehicle display and specifications"
        >
          {/* Car Display */}
          <div 
            className="
              flex-1 min-h-30
              hidden lg:block
              bg-[var(--bg-dark2)]
              rounded-md
              p-2 md:p-3
              border border-[var(--bg-dark3)]
            "
          >
            <CarDisplay carSpecs={carSpecs} selectedCar={selectedCar} />
          </div>
          
          {/* Car Specifications */}
          <div 
            className="
              bg-[var(--bg-dark2)]
              rounded-md
              p-2 md:p-3
              border border-[var(--bg-dark3)]
              min-h-30
              shrink-0
            "
          >
            <CarSpecDisplay 
              carSpecs={carSpecs}
              specGained={getTotalSpecsGained()}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:hidden">
          <CarSpecDisplayMobile 
            carSpecs={carSpecs}
            modifiedSpecs={null}
          />
        </div>

        {/* Modifications Menu */}
        <aside 
          className="
            w-full lg:w-1/3
            bg-[var(--bg-dark1)]
            rounded-lg
            p-2 md:p-3 lg:p-4
            border border-[var(--bg-dark3)]
            shadow-lg
            min-h-0
            overflow-hidden
          "
          role="complementary"
          aria-label="Vehicle modification options"
        >
          <ModsMenu 
            selectedMods={selectedMods}
            selectMod={selectMod}
            deselectMod={deselectMod}
          />
        </aside>
      </section>

      {/* Save Build Dialog */}
      <SaveBuildDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
}