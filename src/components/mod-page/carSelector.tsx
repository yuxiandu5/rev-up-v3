import { carData as carDataList } from "@/data/carData";
import { CarData, CarSpecs, SelectedCar } from "@/types/carTypes";
import MakeSelector from "./sub-comp/makeSelector";
import ModelSelector from "./sub-comp/modelSelector";
import YearSelector from "./sub-comp/yearSelector";
import Button from "../Button";
import CarDisplay from "./sub-comp/carDisplay";


type CarSelectorProps = {
  selectedCar: SelectedCar;
  setSelectedCar: (car: SelectedCar) => void;
  setPhase: (phase: string) => void;
  carSpecs: CarSpecs;
}

export default function CarSelector({selectedCar, setSelectedCar, setPhase, carSpecs}: CarSelectorProps) {
  const carData: CarData = carDataList;

  return (
    <section className="flex flex-col gap-4 items-center justify-center w-full max-h-full pb-10 md:gap-10">
      <header className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-2xl font-bold">Select your car</h1>
      </header>

      <div className="flex items-center justify-center flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl px-4 mt-0">
        <MakeSelector 
          carData={carData} 
          selectedCar={selectedCar} 
          setSelectedCar={setSelectedCar} 
          disabled={false}
        />

        <ModelSelector 
          carData={carData} 
          selectedCar={selectedCar} 
          setSelectedCar={setSelectedCar} 
          disabled={selectedCar.make === ""}
        />    

        <YearSelector 
          carData={carData} 
          selectedCar={selectedCar} 
          setSelectedCar={setSelectedCar} 
          disabled={selectedCar.make === "" || selectedCar.model === ""}
          />
      </div>

      <div className="flex flex-col gap-10 items-center justify-center w-[70%] h-[60%] bg-[var(--bg-dark1)] rounded-md">
        <CarDisplay carSpecs={carSpecs} selectedCar={selectedCar} />
      </div>

      <Button disabled={selectedCar.yearRange === ""} onClick={() => setPhase("mod-selecting")}>Next</Button>

    </section>
  );
}