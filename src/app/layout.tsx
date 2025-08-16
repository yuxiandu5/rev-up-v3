import NavBar from "@/components/NavBar";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-screen pt-20">
        <NavBar />
        <main className="pt-20 w-full h-full flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
