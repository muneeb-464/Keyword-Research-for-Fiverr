import { Trash2 } from "lucide-react";
import { Badge }  from "../components/Badge";
import { fmt, spoColor } from "../utils";
import type { Saved_, Theme } from "../types";

export function SavedPage({ saved, onDelete, theme }: {
  saved: Saved_[]; onDelete: (id: string) => void; theme: Theme;
}) {
  return (
    <div className="rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none outline-none">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-[15px] font-bold text-slate-900 dark:text-slate-100">Saved Keywords</p>
        <p className="text-[12px] text-slate-500 mt-[3px]">{saved.length} keywords saved</p>
      </div>
      {saved.length === 0 ? (
        <p className="text-center text-slate-500 py-12 text-[13px]">
          Click ★ on any row in Analyzer to save keywords here.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[14px] p-5">
          {saved.map(k => (
            <div key={k.id} className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100">{k.keyword}</p>
                <button
                  onClick={() => onDelete(k.id)}
                  className="bg-transparent border-0 cursor-pointer text-slate-600 flex hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-[12px] text-slate-500 mt-[6px]">Competition: {fmt(k.competition)}</p>
              <div className="flex items-center gap-2 mt-[6px]">
                <span className="text-[16px] font-extrabold" style={{ color: spoColor(k.sellerPerOrder, theme) }}>
                  {fmt(k.sellerPerOrder)}
                </span>
                <Badge v={k.sellerPerOrder} theme={theme} />
              </div>
              <p className="text-[11px] text-slate-600 mt-[6px]">{k.savedAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
