"use client";

import { DialogProvider } from "./context";

export default function YearRangesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DialogProvider>
      {children}
    </DialogProvider>
  );
}