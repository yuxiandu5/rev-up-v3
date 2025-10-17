"use client";

import Link from "next/link";
import { ShoppingBag, Grid3X3, Tag, Heart, Package, Settings, User } from "lucide-react";
import { toast } from "sonner";

export default function MarketPlaceSideBar() {
  const navItems = [
    {
      section: "Browse",
      items: [
        { href: "/market-place", label: "All Items", icon: Grid3X3 },
        { href: "/market-place/categories", label: "Categories", icon: Tag },
        { href: "/market-place/deals", label: "Deals & Offers", icon: ShoppingBag },
      ],
    },
    {
      section: "My Account",
      items: [
        { href: "/market-place/orders", label: "My Orders", icon: ShoppingBag },
        { href: "/market-place/favorites", label: "Favorites", icon: Heart },
      ],
    },
    {
      section: "Settings",
      items: [
        { href: "/market-place/profile", label: "Profile", icon: User },
        { href: "/market-place/settings", label: "Market Settings", icon: Settings },
      ],
    },
  ];

  return (
    <nav
      className="sticky top-0 h-full w-[12%] min-w-[220px] max-w-[320px]
      border-r border-[var(--bg-dark3)] bg-[var(--bg-dark1)]
      flex flex-col gap-6 p-4 md:p-5 lg:p-6
    "
    >
      {/* Header */}
      <div className="text-center pb-4 border-b border-[var(--bg-dark3)]">
        <h1 className="text-xl font-bold text-[var(--text1)]">Selected Vehicle</h1>
        <p className="text-sm text-[var(--text2)] mt-1">BMW M3 Competition 2018</p>
      </div>

      {/* Navigation Sections */}
      {navItems.map((section) => (
        <div key={section.section} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wide px-2">
            {section.section}
          </h3>
          <div className="flex flex-col gap-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    flex items-center gap-3 px-3 py-2 rounded-md
                    text-[var(--text1)] hover:text-[var(--highlight)]
                    hover:bg-[var(--bg-dark2)] transition-all duration-200
                    hover:scale-105 active:scale-95
                  "
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="mt-auto pt-4 border-t border-[var(--bg-dark3)]">
        <button
          onClick={() => toast.info("Coming soon")}
          className="
            w-full bg-[var(--accent)] text-white font-medium
            px-4 py-3 rounded-md text-center block
            hover:bg-[var(--highlight)] transition-all duration-200
            hover:scale-105 active:scale-95"
        >
          Sell Your Mod
        </button>
      </div>
    </nav>
  );
}
