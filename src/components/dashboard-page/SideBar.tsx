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
      <LinkButton href="/admin/users">User</LinkButton>
      <LinkButton href="/admin/makes">Make</LinkButton>
      <LinkButton href="/admin/models">Model</LinkButton>
      <LinkButton href="/admin/badges">Badge</LinkButton>
      <LinkButton href="/admin/year-ranges">YearRange</LinkButton>
      <LinkButton href="/admin/mod-categories">ModCategory</LinkButton>
      <LinkButton href="/admin/mods">Mod</LinkButton>
      <LinkButton href="/admin/mod-compatibilities">ModCompatibility</LinkButton>
    </nav>
  );
}
