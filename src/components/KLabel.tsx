export function KLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase mb-[7px]">
      {children}
    </p>
  );
}
