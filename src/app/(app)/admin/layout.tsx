import DashboardSideNavBar from "@/components/dashboard-page/SideBar";

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full w-full">
      <DashboardSideNavBar />
      <section className="flex items-center justify-center overflow-y-auto p-4 md:p-6 lg:p-8 w-full">
        {children}
      </section>
    </div>
  );
}
