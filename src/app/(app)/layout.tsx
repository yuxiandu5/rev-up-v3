
import NavBar from "@/components/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="w-full h-full flex flex-col items-center justify-center pt-12 overflow-y-auto scrollbar-hide lg:pt-20">
        {children}
      </main>
    </>
  );
}
