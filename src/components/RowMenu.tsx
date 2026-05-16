import { useState, useEffect, useRef } from "react";
import { Edit3, Copy, FileDown, Trash2 } from "lucide-react";
import type { Record_, Theme } from "../types";

export function RowMenu({ record, onDelete, onDuplicate, onExport, onEdit, theme: _theme }: {
  record: Record_; onDelete: () => void; onDuplicate: () => void;
  onExport: () => void; onEdit: () => void; theme: Theme;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  void record;

  const items = [
    { icon: <Edit3 size={13}/>,    label: "Edit",       danger: false, action: () => { onEdit();      setOpen(false); } },
    { icon: <Copy size={13}/>,     label: "Duplicate",  danger: false, action: () => { onDuplicate(); setOpen(false); } },
    { icon: <FileDown size={13}/>, label: "Export Row", danger: false, action: () => { onExport();    setOpen(false); } },
    { icon: <Trash2 size={13}/>,   label: "Delete",     danger: true,  action: () => { onDelete();    setOpen(false); } },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-transparent border-0 cursor-pointer text-slate-500 px-[6px] py-1 rounded-md flex hover:text-slate-300 dark:hover:text-slate-300"
      >
        ···
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-[100] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.3)] min-w-[150px] overflow-hidden">
          {items.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={[
                "w-full flex items-center gap-[10px] px-[14px] py-[9px] bg-transparent border-0 cursor-pointer text-[13px] text-left",
                "hover:bg-slate-100 dark:hover:bg-slate-700",
                item.danger ? "text-red-400" : "text-slate-900 dark:text-slate-200",
              ].join(" ")}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
