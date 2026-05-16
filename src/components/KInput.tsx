import type { Theme } from "../types";

export function KInput({ theme: _theme, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { theme: Theme }) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-[10px] px-[14px] py-[10px] text-sm outline-none border",
        "bg-slate-50 border-slate-300 text-slate-900",
        "dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200",
        "focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]",
        className ?? "",
      ].join(" ")}
    />
  );
}
