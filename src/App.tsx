import { useState, useEffect, useCallback } from "react";
import { Plus, LayoutGrid, List, Star, BarChart2, Sun, Moon, Menu, X, LogOut, LogIn } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { NavItem }      from "./components/NavItem";
import { AuthModal }    from "./components/AuthGate";
import { AnalyzerPage } from "./pages/AnalyzerPage";
import { QueuePage }    from "./pages/QueuePage";
import { SavedPage }    from "./pages/SavedPage";
import { MarketPage }   from "./pages/MarketPage";
import { TrendsPage }   from "./pages/TrendsPage";
import { useIsMobile }  from "./hooks/useIsMobile";
import { supabase }     from "./lib/supabase";
import * as db          from "./lib/db";
import { loadTheme, loadPage, savePage } from "./storage";
import type { Record_, Saved_, Page, Theme } from "./types";

export default function App() {
  const [user, setUser]           = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAuth, setShowAuth]   = useState(false);

  const [page, setPage_]        = useState<Page>(loadPage);
  const [history, setHist]      = useState<Record_[]>([]);
  const [allKeywords, setAllKw] = useState<Record_[]>([]);
  const [saved, setSaved]       = useState<Saved_[]>([]);
  const [theme, setTheme_]      = useState<Theme>(loadTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formKeyword, setFormKeyword]   = useState("");
  const [formComp, setFormComp]         = useState("");
  const [formQueue, setFormQueue]       = useState<number[]>([]);
  const [formAvgPrice, setFormAvgPrice] = useState("");

  const isMobile = useIsMobile();

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowAuth(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load data when user logs in ───────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setHist([]); setAllKw([]); setSaved([]);
      return;
    }
    db.loadHistory(user.id).then(setHist).catch(console.error);
    db.loadAllKeywords(user.id).then(setAllKw).catch(console.error);
    db.loadSaved(user.id).then(setSaved).catch(console.error);
  }, [user]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("kp_theme", theme);
  }, [theme]);

  // ── requireAuth: run action if logged in, else show modal ─────────────────
  const requireAuth = useCallback(<T extends unknown[]>(fn: (...args: T) => void) => {
    return (...args: T) => {
      if (!user) { setShowAuth(true); return; }
      fn(...args);
    };
  }, [user]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const setPage = (p: Page) => {
    setPage_(p);
    savePage(p);
    if (isMobile) setSidebarOpen(false);
  };

  // ── Data ops — guest can analyze freely; saving requires login ────────────
  const addRec = requireAuth((r: Record_) => {
    setHist(p => [r, ...p.filter(x => x.id !== r.id)]);
    setAllKw(p => p.find(x => x.id === r.id) ? p : [r, ...p]);
    db.upsertKeyword(user!.id, r).catch(console.error);
  });

  const importRecords = requireAuth((records: Record_[]) => {
    const newIds = new Set(records.map(r => r.id));
    setHist(p => [...records, ...p.filter(x => !newIds.has(x.id))]);
    setAllKw(p => {
      const existingIds = new Set(p.map(x => x.id));
      return [...records.filter(r => !existingIds.has(r.id)), ...p];
    });
    records.forEach(r => db.upsertKeyword(user!.id, r).catch(console.error));
  });

  const delRec = requireAuth((id: string) => {
    setHist(p => p.filter(x => x.id !== id));
    db.deleteFromHistory(user!.id, id).catch(console.error);
  });

  const delAllKw = requireAuth((id: string) => {
    setAllKw(p => p.filter(x => x.id !== id));
    db.deleteKeyword(user!.id, id).catch(console.error);
  });

  const editAllKw = requireAuth((id: string, keyword: string) => {
    setAllKw(p => p.map(x => x.id === id ? { ...x, keyword } : x));
    db.updateKeywordName(user!.id, id, keyword).catch(console.error);
  });

  const addStar = requireAuth((k: Saved_) => {
    setSaved(p => p.find(x => x.keyword === k.keyword) ? p : [k, ...p]);
    db.upsertSaved(user!.id, k).catch(console.error);
  });

  const delStar = requireAuth((id: string) => {
    setSaved(p => p.filter(x => x.id !== id));
    db.deleteSaved(user!.id, id).catch(console.error);
  });

  const resetHistory = requireAuth(() => {
    setHist([]);
    setFormKeyword(""); setFormComp(""); setFormQueue([]); setFormAvgPrice("");
    setPage("analyzer");
    db.resetHistory(user!.id).catch(console.error);
  });

  const toggleTheme = () => setTheme_(t => t === "dark" ? "light" : "dark");

  const signOut = async () => {
    await supabase.auth.signOut();
    setHist([]); setAllKw([]); setSaved([]);
  };

  const newAnalysis = () => {
    setFormKeyword(""); setFormComp(""); setFormQueue([]); setFormAvgPrice("");
    setPage("analyzer");
  };

  // ── Nav config ────────────────────────────────────────────────────────────
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

  const sidebarVisible = !isMobile || sidebarOpen;

  if (!authReady) return null;

  return (
    <div className="flex h-screen overflow-hidden relative bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-[Inter,system-ui,sans-serif]">

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

      {sidebarVisible && (
        <aside className={[
          "w-[216px] min-w-[216px] bg-slate-50 dark:bg-[#131929]",
          "border-r border-slate-200 dark:border-slate-800",
          "flex flex-col overflow-hidden",
          isMobile ? "fixed top-0 left-0 bottom-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.3)]" : "",
        ].join(" ")}>

          <div className="px-[18px] pt-[18px] pb-[14px] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[18px] font-black text-blue-500 tracking-[-0.5px]">KeywordPulse</span>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="bg-transparent border-0 cursor-pointer text-slate-500 flex p-1"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="px-3 pt-[13px] pb-[10px]">
            <button
              onClick={newAnalysis}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-[13px] font-bold py-[10px] rounded-[10px] border-0 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Plus size={15} /> New Analysis
            </button>
          </div>

          <nav className="px-2 py-1 flex flex-col gap-[2px] flex-1">
            {sideNav.map(n => (
              <NavItem key={n.id} icon={n.icon} label={n.label} active={page === n.id} onClick={() => setPage(n.id)} theme={theme} />
            ))}
          </nav>

          <div className="px-4 pt-3 pb-4 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2 truncate text-center" title={user.email}>
                {user.email}
              </p>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="w-full flex items-center justify-center gap-[6px] text-[12px] font-semibold text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-lg py-[7px] cursor-pointer mb-2"
              >
                <LogIn size={13} /> Sign in to save data
              </button>
            )}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-[1.7] text-center">
              Designed &amp; Developed by<br/>
              <span className="font-bold">Muhannad Munib Sajjad</span>
            </p>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        <header className="h-12 bg-slate-50 dark:bg-[#131929] border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-1 shrink-0">

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="bg-transparent border-0 cursor-pointer text-slate-500 flex px-[6px] py-1 mr-[6px] rounded-md"
            >
              <Menu size={20} />
            </button>
          )}

          {topNav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={[
                "bg-transparent border-b-2 cursor-pointer font-semibold px-2 h-full whitespace-nowrap transition-all duration-150",
                isMobile ? "text-[12px]" : "text-[13px]",
                page === n.id ? "border-blue-500 text-blue-500" : "border-transparent text-slate-500",
              ].join(" ")}>
              {n.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="flex items-center gap-[5px] bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer text-[12px] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap px-2 py-[5px] md:px-3 md:py-[6px]"
            >
              {theme === "dark"
                ? <><Sun size={13}/> <span className="hidden md:inline">Light</span></>
                : <><Moon size={13}/> <span className="hidden md:inline">Dark</span></>
              }
            </button>
            {user ? (
              <button
                onClick={signOut}
                title="Sign out"
                className="flex items-center gap-[5px] bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer text-[12px] font-semibold text-slate-500 dark:text-slate-400 px-2 py-[5px] md:px-3 md:py-[6px]"
              >
                <LogOut size={13}/> <span className="hidden md:inline">Sign out</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-[5px] bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-lg cursor-pointer text-[12px] font-semibold px-3 py-[6px]"
              >
                <LogIn size={13}/> Sign in
              </button>
            )}
          </div>
        </header>

        {/* Guest banner */}
        {!user && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-[6px] flex items-center justify-between shrink-0">
            <span className="text-[12px] text-blue-400">
              Browsing as guest — analyses not saved.
            </span>
            <button
              onClick={() => setShowAuth(true)}
              className="text-[12px] font-semibold text-blue-400 underline bg-transparent border-0 cursor-pointer"
            >
              Sign in to save
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-[14px_12px] md:p-[20px_22px]">
          {page === "analyzer" && (
            <AnalyzerPage
              history={history} onSave={addRec} onDeleteRecord={delRec}
              onStar={addStar} onResetHistory={resetHistory} theme={theme}
              keyword={formKeyword} setKeyword={setFormKeyword}
              compRaw={formComp}   setCompRaw={setFormComp}
              queue={formQueue}    setQueue={setFormQueue}
              avgPriceRaw={formAvgPrice} setAvgPriceRaw={setFormAvgPrice}
            />
          )}
          {page === "queue"   && <QueuePage  history={allKeywords} onDelete={delAllKw} onEdit={editAllKw} theme={theme} userId={user?.id} onImport={importRecords} />}
          {page === "saved"   && <SavedPage  saved={saved} onDelete={delStar} theme={theme} />}
          {page === "market"  && <MarketPage history={history} theme={theme} />}
          {page === "history" && <QueuePage  history={allKeywords} onDelete={delAllKw} onEdit={editAllKw} theme={theme} userId={user?.id} />}
          {page === "trends"  && <TrendsPage history={history} theme={theme} />}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 px-5 py-2 text-center text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
          Designed &amp; Developed by <span className="font-bold">Muhannad Munib Sajjad</span>
        </footer>

      </div>
    </div>
  );
}
