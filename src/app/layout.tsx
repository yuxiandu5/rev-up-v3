import NavBar from "@/components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen">
        <NavBar />
        <main className="w-full h-full flex flex-col items-center justify-center pt-12 overflow-y-auto scrollbar-hide lg:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
