"use client";

import LinkButton from "@/components/ui/LinkButton";

export default function DashboardSideNavBar() {
  return (
    <nav
      className="sticky top-0 h-full w-[12%] min-w-[220px] max-w-[320px]
                border-r border-[var(--bg-dark3)] bg-[var(--bg-dark1)]
                flex flex-col gap-2 p-4 md:p-5 lg:p-6
                text-center
                "
    >
      <LinkButton href="/admin/users">Users</LinkButton>
    </nav>
  );
}
