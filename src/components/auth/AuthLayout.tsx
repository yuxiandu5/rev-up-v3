import React from "react";
import Link from "next/link";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
};

export default function AuthLayout({ children, title, subtitle, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-full min-w-full bg-[var(--bg-dark2)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image src="/logo/logo.png" alt="Logo" width={140} height={140} />
          </Link>

          <h2 className="mt-0 text-3xl font-bold text-[var(--text1)]">{title}</h2>

          {subtitle && <p className="mt-2 text-sm text-[var(--text2)]">{subtitle}</p>}
        </div>

        {/* Main Content */}
        <div className="bg-[var(--bg-dark1)] py-8 px-6 rounded-xl border border-[var(--bg-dark3)]">
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="text-center text-sm text-[var(--text2)] mt-0">{footer}</div>}
      </div>
    </div>
  );
}
