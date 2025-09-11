"use client";

import { useEffect } from "react";
import { useModStore } from "@/stores/modStore";
import { setModClearCallback } from "@/stores/carStore";

export const useStoreConnection = () => {
  const clearAllMods = useModStore((state) => state.clearAllMods);

  useEffect(() => {
    setModClearCallback(clearAllMods);

    return () => {
      setModClearCallback(() => {});
    };
  }, [clearAllMods]);
};
