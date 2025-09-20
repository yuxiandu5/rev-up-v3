export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full flex flex-col items-center justify-center overflow-y-auto scrollbar-hide">
      {children}
    </main>
  );
}
