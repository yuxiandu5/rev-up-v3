"use client";

import { AuthInitializer } from "@/components/AuthInitializer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col h-screen w-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthInitializer>{children}</AuthInitializer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
