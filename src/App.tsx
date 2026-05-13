import { useState, useEffect } from "react";
import { Plus, LayoutGrid, List, Star, BarChart2, Sun, Moon, Menu, X } from "lucide-react";
import { NavItem }      from "./components/NavItem";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { QueuePage }    from "./pages/QueuePage";
import { SavedPage }    from "./pages/SavedPage";
import { MarketPage }   from "./pages/MarketPage";
import { TrendsPage }   from "./pages/TrendsPage";
import { useIsMobile }  from "./hooks/useIsMobile";
import {
  loadHistory, saveHistory, loadAllKeywords, saveAllKeywords,
  loadTheme, loadPage, savePage, loadSaved, saveSaved,
} from "./storage";
import type { Record_, Saved_, Page, Theme } from "./types";

export default function App() {
  const [page, setPage_]        = useState<Page>(loadPage);
  const [history, setHist]      = useState<Record_[]>(loadHistory);
  const [allKeywords, setAllKw] = useState<Record_[]>(loadAllKeywords);
  const [saved, setSaved]       = useState<Saved_[]>(loadSaved);
  const [theme, setTheme_]      = useState<Theme>(loadTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formKeyword, setFormKeyword] = useState("");
  const [formComp, setFormComp]       = useState("");
  const [formQueue, setFormQueue]     = useState<number[]>([]);

  const isMobile = useIsMobile();

  const setPage = (p: Page) => {
    setPage_(p);
    savePage(p);
    if (isMobile) setSidebarOpen(false);
  };

  useEffect(() => { document.body.className = theme; localStorage.setItem("kp_theme", theme); }, [theme]);
  useEffect(() => { saveHistory(history); }, [history]);
  useEffect(() => { saveAllKeywords(allKeywords); }, [allKeywords]);
  useEffect(() => { saveSaved(saved); }, [saved]);

  const addRec = (r: Record_) => {
    setHist(p => [r, ...p.filter(x => x.id !== r.id)]);
    setAllKw(p => p.find(x => x.id === r.id) ? p : [r, ...p]);
  };
  const delRec    = (id: string) => setHist(p => p.filter(x => x.id !== id));
  const delAllKw  = (id: string) => setAllKw(p => p.filter(x => x.id !== id));
  const editAllKw = (id: string, kw: string) => setAllKw(p => p.map(x => x.id === id ? { ...x, keyword: kw } : x));
  const addStar   = (k: Saved_) => setSaved(p => p.find(x => x.keyword === k.keyword) ? p : [k, ...p]);
  const delStar   = (id: string) => setSaved(p => p.filter(x => x.id !== id));
  const toggleTheme = () => setTheme_(t => t === "dark" ? "light" : "dark");

  const newAnalysis = () => {
    setFormKeyword(""); setFormComp(""); setFormQueue([]);
    setPage("analyzer");
  };
  const resetHistory = () => {
    setHist([]); setFormKeyword(""); setFormComp(""); setFormQueue([]);
    setPage("analyzer");
  };

  const topNav = [
    { id: "analyzer" as Page, label: "Dashboard" },
    { id: "history"  as Page, label: "History"   },
    { id: "trends"   as Page, label: "Trends"    },
  ];
  const sideNav = [
    { id: "analyzer" as Page, label: "Analyzer",      icon: <LayoutGrid size={16}/> },
    { id: "queue"    as Page, label: "Order Queue",    icon: <List size={16}/> },
    { id: "saved"    as Page, label: "Saved Keywords", icon: <Star size={16}/> },
    { id: "market"   as Page, label: "Market Report",  icon: <BarChart2 size={16}/> },
  ];

  const sidebarBg  = theme === "dark" ? "#131929" : "#f8fafc";
  const sidebarBdr = theme === "dark" ? "#1e293b" : "#e2e8f0";
  const mainBg     = theme === "dark" ? "#0f172a" : "#f1f5f9";
  const footerColor = theme === "dark" ? "#475569" : "#94a3b8";

  const sidebarVisible = !isMobile || sidebarOpen;

  return (
    <div style={{ display: "flex", height: "100vh", background: mainBg, color: theme === "dark" ? "#e2e8f0" : "#0f172a", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Sidebar */}
      {sidebarVisible && (
        <aside style={{
          width: 216, minWidth: 216, background: sidebarBg,
          borderRight: `1px solid ${sidebarBdr}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
          ...(isMobile ? {
            position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
            boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
          } : {}),
        }}>
          <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${sidebarBdr}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#3b82f6", letterSpacing: "-0.5px" }}>KeywordPulse</span>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 4 }}>
                <X size={18} />
              </button>
            )}
          </div>

          <div style={{ padding: "13px 12px 10px" }}>
            <button onClick={newAnalysis}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 700, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#3b82f6"; }}>
              <Plus size={15} /> New Analysis
            </button>
          </div>

          <nav style={{ padding: "4px 8px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {sideNav.map(n => (
              <NavItem key={n.id} icon={n.icon} label={n.label} active={page === n.id} onClick={() => setPage(n.id)} theme={theme} />
            ))}
          </nav>

          {/* Credit */}
          <div style={{ padding: "12px 16px 16px", borderTop: `1px solid ${sidebarBdr}` }}>
            <p style={{ fontSize: 10, color: footerColor, lineHeight: 1.7, textAlign: "center" }}>
              Designed &amp; Developed by<br/>
              <span style={{ fontWeight: 700, color: theme === "dark" ? "#64748b" : "#94a3b8" }}>Muhannad Munib Sajjad</span>
            </p>
          </div>
        </aside>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ height: 48, background: sidebarBg, borderBottom: `1px solid ${sidebarBdr}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 4, flexShrink: 0 }}>

          {/* Hamburger on mobile */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: "4px 6px", marginRight: 6, borderRadius: 6 }}>
              <Menu size={20} />
            </button>
          )}

          {topNav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ background: "none", border: "none", borderBottom: page === n.id ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", fontSize: isMobile ? 12 : 13, fontWeight: 600, color: page === n.id ? "#3b82f6" : "#64748b", padding: "0 8px", height: "100%", transition: "all 0.15s", whiteSpace: "nowrap" }}>
              {n.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={toggleTheme}
              style={{ display: "flex", alignItems: "center", gap: 5, background: theme === "dark" ? "#1e293b" : "#e2e8f0", border: `1px solid ${sidebarBdr}`, borderRadius: 8, padding: isMobile ? "5px 8px" : "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: theme === "dark" ? "#94a3b8" : "#475569", whiteSpace: "nowrap" }}
              title="Toggle theme">
              {theme === "dark" ? <><Sun size={13}/> {!isMobile && "Light"}</> : <><Moon size={13}/> {!isMobile && "Dark"}</>}
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px" : "20px 22px" }}>
          {page === "analyzer" && (
            <AnalyzerPage
              history={history} onSave={addRec} onDeleteRecord={delRec}
              onStar={addStar} onResetHistory={resetHistory} theme={theme}
              keyword={formKeyword} setKeyword={setFormKeyword}
              compRaw={formComp}   setCompRaw={setFormComp}
              queue={formQueue}    setQueue={setFormQueue}
            />
          )}
          {page === "queue"   && <QueuePage  history={allKeywords} onDelete={delAllKw} onEdit={editAllKw} theme={theme} />}
          {page === "saved"   && <SavedPage  saved={saved} onDelete={delStar} theme={theme} />}
          {page === "market"  && <MarketPage history={history} theme={theme} />}
          {page === "history" && <QueuePage  history={allKeywords} onDelete={delAllKw} onEdit={editAllKw} theme={theme} />}
          {page === "trends"  && <TrendsPage history={history} theme={theme} />}
        </main>

        {/* Footer credit */}
        <footer style={{ borderTop: `1px solid ${sidebarBdr}`, padding: "8px 20px", textAlign: "center", fontSize: 11, color: footerColor, flexShrink: 0 }}>
          Designed &amp; Developed by <span style={{ fontWeight: 700 }}>Muhannad Munib Sajjad</span>
        </footer>

      </div>
    </div>
  );
}
