"use client";
import CarSelector from "@/components/mod-page/carSelector";
import ModSelector from "@/components/mod-page/modSelector";
import { carData } from "@/data/carData";
import { CarSpecs, SelectedCar } from "@/types/carTypes";
import { SelectedMods } from "@/types/modTypes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Mod() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<string>("car-selecting");
  const [selectedCar, setSelectedCar] = useState<SelectedCar>({
    make: "",
    model: "",
    yearRange: "",
  });
  const [selectedMods, setSelectedMods] = useState<SelectedMods>({});
  
  // get car specs from car data
  const carSpecs: CarSpecs = selectedCar.yearRange 
  ? carData[selectedCar.make][selectedCar.model][selectedCar.yearRange] 
  : {image: "", hp: 0, torque: 0, zeroTo100: 0, handling: 0};

  // get stored car and phase from session storage
  useEffect(() => {
    const storedCar = sessionStorage.getItem("selectedCar");
    if (storedCar !== null) {
      const parsedCar = JSON.parse(storedCar);
      if (JSON.stringify(parsedCar) !== JSON.stringify(selectedCar)) {
        setSelectedCar(parsedCar);
      }
    }

    const storedPhase = sessionStorage.getItem("phase");
    if (storedPhase !== null && storedPhase !== phase) {
      setPhase(storedPhase);
    }

    const storedMods = sessionStorage.getItem("selectedMods");
    if (storedMods !== null) {
      const parsedMods = JSON.parse(storedMods);
      if (JSON.stringify(parsedMods) !== JSON.stringify(selectedMods)) {
        setSelectedMods(parsedMods);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    setSelectedMods({});
  }, [selectedCar]);
  
  // set stored car and phase in session storage
  useEffect(() => {
    sessionStorage.setItem("selectedCar", JSON.stringify(selectedCar));
    sessionStorage.setItem("phase", phase);
    sessionStorage.setItem("selectedMods", JSON.stringify(selectedMods));
  }, [selectedCar, phase, selectedMods]);

  if (!hydrated) return <div>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-10 items-center justify-center w-[95vw] h-full lg:w-[80vw]"
    >
      {
        phase === "car-selecting" ? 
          <CarSelector 
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            setPhase={setPhase}
            carSpecs={carSpecs}
          /> 
          : 
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            <ModSelector 
              carSpecs={carSpecs} 
              selectedCar={selectedCar} 
              setPhase={setPhase}
              selectedMods={selectedMods}
              setSelectedMods={setSelectedMods}
              />
          </motion.div>
      }
    </motion.div>
  );
}