import type { Theme } from "../types";

export function NavItem({ icon, label, active, onClick, theme: _theme }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; theme: Theme;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-[10px] w-full px-3 py-[9px] rounded-[10px] cursor-pointer text-[13px] text-left border-l-2 transition-colors",
        active
          ? "bg-blue-500/[0.12] text-blue-500 border-l-blue-500 font-semibold"
          : "bg-transparent text-slate-500 border-l-transparent font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200",
      ].join(" ")}
    >
      {icon} {label}
    </button>
  );
}
