import type { Theme, Page } from "./types";

export function loadTheme(): Theme {
  try { return (localStorage.getItem("kp_theme") as Theme) || "dark"; } catch { return "dark"; }
}
export function loadPage(): Page {
  try { return (localStorage.getItem("kp_page") as Page) || "analyzer"; } catch { return "analyzer"; }
}
export function savePage(p: Page) {
  try { localStorage.setItem("kp_page", p); } catch {}
}
