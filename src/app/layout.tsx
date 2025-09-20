"use client";

import { AuthInitializer } from "@/components/AuthInitializer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen">
        <AuthInitializer>{children}</AuthInitializer>
        <Toaster />
      </body>
    </html>
  );
}
