import { CarSpecs, SelectedCar } from "@/types/carTypes2";
import Image from "next/image";
import { motion } from "framer-motion";

type CarDisplayProps = {
  carSpecs: CarSpecs | null;
  selectedCar: SelectedCar;
}

export default function CarDisplay({carSpecs, selectedCar}: CarDisplayProps) {
  return (
      <div className="flex flex-col gap-6 md:gap-10 items-center justify-center w-full h-full">
        {selectedCar.yearRange ? 
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className=" w-full max-w-lg aspect-[4/3] md:aspect-[3/2] flex flex-col items-center justify-center relative h-full"
        >
          <Image 
            src={carSpecs?.url || ""} 
            alt={`${selectedCar.make} ${selectedCar.model}`} 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 70vw"
          />
        </motion.div> : 
        <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text2)] px-4">
          <h1 className="text-xl md:text-2xl font-bold text-center">
            Select a vehicle to preview
            <br />
            <span className="text-xs md:text-sm">Choose make, model, and year to see your vehicle&apos;s specs</span>
          </h1>
        </div>}
      </div>
  );
}