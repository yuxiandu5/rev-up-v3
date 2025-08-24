import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";
import { formatPrice } from "@/utils/modCalculations";

type AnimatedPriceProps = {
  price: number;
  duration?: number;
};

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  decimals?: number;
  type?: "price" | "number";
};

export function AnimatedNumber({
  value,
  duration = 0.5,
  decimals,
  type = "number"
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      onUpdate: (latest) => {
        setDisplayValue(
          latest.toFixed(
            decimals !== undefined
              ? decimals
              : Number.isInteger(value) ? 0 : 1
          )
        );
      },
    });
    return () => controls.stop();
  }, [value, duration, decimals, motionValue]);

  return <span>{type === "price" ? formatPrice(Number(displayValue)) : displayValue}</span>;
}

export function AnimatedPrice({ price, duration = 0.5 }: AnimatedPriceProps) {
  return (
    <span>
      <AnimatedNumber value={price} duration={duration} type="price" />
    </span>
  );
}
