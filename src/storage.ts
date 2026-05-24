import type { Record_, Theme, Page, Saved_ } from "./types";
import { calcSPO } from "./utils";

const SEED: Record_[] = [
  { id:"s1", keyword:"Minimalist Logo",  competition:12400, queueSum:45,  avgOrders:2.25, sellerPerOrder:calcSPO(12400,45),  date:"Oct 24, 2024" },
  { id:"s2", keyword:"Python Scripting", competition:4200,  queueSum:18,  avgOrders:0.9,  sellerPerOrder:calcSPO(4200,18),   date:"Oct 23, 2024" },
  { id:"s3", keyword:"UGC Video Ad",     competition:8900,  queueSum:124, avgOrders:6.2,  sellerPerOrder:calcSPO(8900,124),  date:"Oct 23, 2024" },
  { id:"s4", keyword:"Shopify SEO",      competition:15600, queueSum:32,  avgOrders:1.6,  sellerPerOrder:calcSPO(15600,32),  date:"Oct 22, 2024" },
];

export function loadHistory(): Record_[] {
  try { const d = localStorage.getItem("kp_history"); return d ? JSON.parse(d) : SEED; } catch { return SEED; }
}
export function saveHistory(h: Record_[]) {
  try { localStorage.setItem("kp_history", JSON.stringify(h)); } catch {}
}
export function loadAllKeywords(): Record_[] {
  try { const d = localStorage.getItem("kp_all_keywords"); return d ? JSON.parse(d) : SEED; } catch { return SEED; }
}
export function saveAllKeywords(h: Record_[]) {
  try { localStorage.setItem("kp_all_keywords", JSON.stringify(h)); } catch {}
}
export function loadTheme(): Theme {
  try { return (localStorage.getItem("kp_theme") as Theme) || "dark"; } catch { return "dark"; }
}
export function loadPage(): Page {
  try { return (localStorage.getItem("kp_page") as Page) || "analyzer"; } catch { return "analyzer"; }
}
export function savePage(p: Page) {
  try { localStorage.setItem("kp_page", p); } catch {}
}
export function loadSaved(): Saved_[] {
  try { const d = localStorage.getItem("kp_saved"); return d ? JSON.parse(d) : []; } catch { return []; }
}
export function saveSaved(s: Saved_[]) {
  try { localStorage.setItem("kp_saved", JSON.stringify(s)); } catch {}
}
export function loadStarred(): Set<string> {
  try { const d = localStorage.getItem("kp_starred"); return d ? new Set(JSON.parse(d)) : new Set(); } catch { return new Set(); }
}
export function saveStarred(s: Set<string>) {
  try { localStorage.setItem("kp_starred", JSON.stringify([...s])); } catch {}
}
