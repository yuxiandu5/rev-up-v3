"use client";
import CarSelector from "@/components/mod-page/carSelector";
import ModSelector from "@/components/mod-page/modSelector";
import { SelectedMods } from "@/types/modTypes";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCarStore } from "@/stores/carStore";

export default function Mod() {
  const { selectedCar, carSpecs } = useCarStore();
  const [phase, setPhase] = useState<string>("car-selecting");
  const [selectedMods, setSelectedMods] = useState<SelectedMods>({});

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
            setPhase={setPhase}
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