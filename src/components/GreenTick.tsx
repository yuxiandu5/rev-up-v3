export default function GreenTick() {
  return (
    <div className="w-16 h-16 mx-auto bg-[var(--green)]/20 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-[var(--green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}