"use client";

import { CreateYearRangeInput } from "@/lib/validations";
import { createContext, useState } from "react";

interface OpenDialogContextType {
  open: boolean;
  setOpenDialog: (value: boolean) => void;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  data: CreateYearRangeInput | null;
  setData: (value: CreateYearRangeInput) => void;
  id: string;
  setId: (value: string) => void
}

export const OpenDialogContext = createContext<OpenDialogContextType | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<CreateYearRangeInput | null>(null);
  const [id, setId] = useState<string>("")

  return (
    <OpenDialogContext.Provider value={{ open, setOpenDialog, isEdit, setIsEdit, data, setData, id, setId }}>
      {children}
    </OpenDialogContext.Provider>
  );
}
