"use client";
import CarSelector from "@/components/mod-page/carSelector";
import ModSelector from "@/components/mod-page/modSelector";
import { carData } from "@/data/carData";
import { CarSpecs, SelectedCar } from "@/types/carTypes";
import { useEffect, useState } from "react";

export default function Mod() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<string>("car-selecting");
  const [selectedCar, setSelectedCar] = useState<SelectedCar>({
    make: "",
    model: "",
    yearRange: "",
  });

  // get car specs from car data
  const carSpecs: CarSpecs = selectedCar.yearRange 
  ? carData[selectedCar.make][selectedCar.model][selectedCar.yearRange] 
  : {image: "", hp: 0, torque: 0, zeroTo100: 0, handling: 0};

  // get stored car and phase from session storage
  useEffect(() => {
    const storedCar = sessionStorage.getItem("selectedCar");
    if (storedCar !== null && storedCar !== JSON.stringify(selectedCar)) setSelectedCar(JSON.parse(storedCar));
    const storedPhase = sessionStorage.getItem("phase");
    if (storedPhase !== null && storedPhase !== phase) {
      setPhase(storedPhase);
    }
    setHydrated(true);
  }, []);

  // set stored car and phase in session storage
  useEffect(() => {
    sessionStorage.setItem("selectedCar", JSON.stringify(selectedCar));
    sessionStorage.setItem("phase", phase);
  }, [selectedCar, phase]);

  if (!hydrated) return <div>Loading...</div>;

  return (
    <main className="flex flex-col gap-10 items-center justify-center w-[80vw] h-full">
      {
        phase === "car-selecting" ? 
          <CarSelector 
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            setPhase={setPhase}
            carSpecs={carSpecs}
          /> 
          : 
          <ModSelector carSpecs={carSpecs} selectedCar={selectedCar} setPhase={setPhase}/>
      }
    </main>
  );
}