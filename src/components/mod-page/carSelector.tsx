import MakeSelector from "./sub-comp/makeSelector";
import ModelSelector from "./sub-comp/modelSelector";
import BadgeSelector from "./sub-comp/badgeSelector";
import YearRangeSelector from "./sub-comp/yearRangeSelector";
import Button from "../Button";
import CarDisplay from "./sub-comp/carDisplay";
import { useCarStore } from "@/stores/carStore";
import { useEffect } from "react";
import { LoadingOverlay } from "@/components/ui/Loading";


type CarSelectorProps = {
  setPhase: (phase: string) => void;
}

export default function CarSelector({ setPhase }: CarSelectorProps) {
  const { makes, selectMake, selectedCar, models, selectModel, fetchMakes, badges, selectBadge, yearRanges, selectYearRange, carSpecs, fetchModels, fetchBadges, fetchYearRanges, loading } = useCarStore();


  useEffect(() => {
    fetchMakes();
    fetchModels(selectedCar.makeId);
    fetchBadges(selectedCar.modelId);
    fetchYearRanges(selectedCar.badgeId);
  }, []);

  return (
    <LoadingOverlay 
      show={loading.makes} 
      variant="spinner" 
      text="Loading car data..."
      showText
    >
      <section className="flex flex-col gap-4 items-center justify-center w-full min-h-full pb-10 md:gap-10">
        <header className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-2xl font-bold">Select your car</h1>
        </header>

        <div className="flex items-center justify-center flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl px-4 mt-0">
          <MakeSelector  
            selectedCar={selectedCar} 
            selectMake={selectMake} 
            makes={makes} 
            disabled={loading.makes}
          />

          <ModelSelector 
            models={models} 
            selectedCar={selectedCar} 
            selectModel={selectModel} 
            disabled={selectedCar.make === "" || loading.models}
          />    

          <BadgeSelector 
            badges={badges} 
            selectedCar={selectedCar} 
            selectBadge={selectBadge} 
            disabled={selectedCar.make === "" || selectedCar.model === "" || loading.badges}
          />

          <YearRangeSelector 
            yearRanges={yearRanges} 
            selectedCar={selectedCar} 
            selectYearRange={selectYearRange} 
            disabled={selectedCar.make === "" || selectedCar.model === "" || selectedCar.badge === "" || loading.yearRanges}
          />
        </div>

        <div className="flex flex-col gap-10 items-center justify-center w-[70%] h-[60%] bg-[var(--bg-dark1)] rounded-md">
          <CarDisplay carSpecs={carSpecs} selectedCar={selectedCar} />
        </div>

        <Button disabled={selectedCar.yearRange === "" || isAnyLoading} onClick={() => setPhase("mod-selecting")}>
          Next
        </Button>

      </section>
    </LoadingOverlay>
  );
}