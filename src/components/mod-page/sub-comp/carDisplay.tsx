import { CarSpecs, SelectedCar } from "@/types/carTypes";
import Image from "next/image";

type CarDisplayProps = {
  carSpecs: CarSpecs;
  selectedCar: SelectedCar;
}

export default function CarDisplay({carSpecs, selectedCar}: CarDisplayProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-10 items-center justify-center w-full h-full">
      {selectedCar.yearRange ? 
      <div className=" w-full max-w-lg aspect-[4/3] md:aspect-[3/2] flex flex-col items-center justify-center relative">
        <Image 
          src={carSpecs.image} 
          alt={`${selectedCar.make} ${selectedCar.model}`} 
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 70vw"
        />
      </div> : 
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