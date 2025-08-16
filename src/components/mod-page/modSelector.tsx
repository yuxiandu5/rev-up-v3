import { CarSpecs, SelectedCar } from "@/types/carTypes";
import { ArrowLeftIcon } from "lucide-react";
import CarDisplay from "./sub-comp/carDisplay";
import Button from "../Button";
import ModsMenu from "./sub-comp/modsMenu";
import CarSpecDisplay from "./sub-comp/carSpecDisplay";

type ModSelectorProps = {
  carSpecs: CarSpecs;
  selectedCar: SelectedCar;
  setPhase: (phase: string) => void;
}

export default function ModSelector({carSpecs, selectedCar, setPhase}: ModSelectorProps) {
  return (
    <section 
      className="
        flex flex-col gap-2 md:gap-3 lg:gap-4 
        w-full h-full max-h-screen overflow-hidden
        p-2 md:p-4 lg:p-6
        bg-[var(--bg-dark2)]
      "
      role="main"
      aria-label="Vehicle modification interface"
    >

      {/* Vehicle Header */}
      <header 
        className="
          flex flex-col items-center justify-center
          text-center
          py-2
          relative
        "
      >
        <Button 
          className="
            flex items-center gap-0 lg:gap-2 
            transition-all duration-200 
            absolute top-8 left-0 lg:top-4 lg:left-4
            hover:translate-x-[-2px] hover:shadow-lg
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-dark2)]
            w-6 h-6 lg:w-auto lg:h-auto p-0.5 lg:px-3 lg:py-1.5 min-w-0
          " 
          onClick={() => setPhase("car-selecting")} 
          variant="secondary"
          size="sm"
          aria-label="Return to car selection page"
        >
          <ArrowLeftIcon className="w-3 h-3 lg:w-4 lg:h-4 text-[var(--text1)]" aria-hidden="true" />
          <span className="hidden lg:inline text-sm text-[var(--text1)] font-medium">
            Back to Car Selection
          </span>
        </Button>
        <h1 
          className="
            text-lg md:text-xl lg:text-2xl 
            font-bold 
            text-[var(--text1)]
            leading-tight
          "
          id="vehicle-title"
        >
          {selectedCar.make} {selectedCar.model}
        </h1>
        <span
          className="
            text-xs md:text-sm 
            text-[var(--text2)]
            font-medium
          "
          aria-describedby="vehicle-title"
        >
          {selectedCar.yearRange}
        </span>
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
          overflow-hidden
        "
        aria-labelledby="vehicle-title"
      >
        {/* Vehicle Display and Specs */}
        <div 
          className="
            flex flex-col gap-2 md:gap-3
            w-full lg:w-2/3
            bg-[var(--bg-dark1)]
            rounded-lg
            p-2 md:p-3 lg:p-4
            border border-[var(--bg-dark3)]
            shadow-lg
            flex-2 min-h-0
            overflow-hidden
          "
          role="region"
          aria-label="Vehicle display and specifications"
        >
          {/* Car Display */}
          <div 
            className="
              flex-1 min-h-0
              bg-[var(--bg-dark2)]
              rounded-md
              p-2 md:p-3
              border border-[var(--bg-dark3)]
              overflow-hidden
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
              min-h-[40%]
              shrink-0
            "
          >
            <CarSpecDisplay 
              carSpecs={carSpecs}

            />
          </div>
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
            flex-1 min-h-0
            overflow-hidden
          "
          role="complementary"
          aria-label="Vehicle modification options"
        >
          <ModsMenu />
        </aside>
      </section>
    </section>
  );
}