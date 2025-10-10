import MarketPlaceSideBar from "./components/MarketPlaceSideBar";
export default function MarketPlaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full w-full">
      <MarketPlaceSideBar />
      <section className="flex items-center justify-center overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
        {children}
      </section>
    </div>
  );
}
