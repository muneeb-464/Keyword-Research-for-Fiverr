import { fmt } from "../utils";
import type { Theme } from "../types";

export function StatCard({ label, value, accent, note, icon, theme: _theme }: {
  label: string; value: number | string; accent?: boolean; note?: string;
  icon?: React.ReactNode; theme: Theme;
}) {
  return (
    <div className={[
      "rounded-xl px-[14px] py-[10px] border",
      accent
        ? "bg-green-500/[0.08] border-green-500/25"
        : "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-700",
    ].join(" ")}>
      <div className="flex justify-between items-start mb-[6px]">
        <p className="text-[10px] font-bold tracking-[0.1em] text-slate-500 uppercase">{label}</p>
        {icon && (
          <span className={`opacity-70 ${accent ? "text-green-500" : "text-slate-500"}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={[
        "text-[20px] font-extrabold leading-none",
        accent ? "text-green-500" : "text-slate-900 dark:text-slate-100",
      ].join(" ")}>
        {typeof value === "number" ? fmt(value) : value}
      </p>
      {note && <p className="text-[11px] text-slate-500 mt-[6px]">{note}</p>}
    </div>
  );
}
