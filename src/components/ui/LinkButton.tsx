import Link from "next/link";

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
};

export default function LinkButton({ href, children }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className="
      text-[var(--text1)] font-medium transition-all duration-200
      hover:text-[var(--highlight)] active:scale-95 mt-4
      px-3 py-2 rounded bg-[var(--bg-dark2)] hover:bg-[var(--bg-dark3)]"
    >
      {children}
    </Link>
  );
}
