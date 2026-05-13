# 🔍 KeywordPulse

> A professional Fiverr keyword research tool built for freelancers — analyze competition, calculate market opportunity, and make data-driven gig decisions.

![KeywordPulse](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-3b82f6?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Bundler-Vite-646cff?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

---

## ✨ Features

- **Keyword Analyzer** — Enter keyword + competition + order queue to instantly calculate Seller Per Order (SPO)
- **Fiverr Criteria** — 6-tier rating system (Excellent → Very Hard) based on SPO value
- **Analysis History** — Searchable, sortable table with inline edit, star, duplicate & per-row export
- **Order Queue** — Permanent keyword bank that never resets — star, edit, delete & download all
- **Saved Keywords** — Star any keyword to save it for quick reference
- **Market Report** — Overview stats: best opportunity, most saturated keyword, averages
- **Trends Charts** — SPO trend line + Competition vs SPO dual-axis chart (Recharts)
- **Dark / Light Theme** — Smooth toggle, persisted to localStorage
- **CSV Export** — Download current analysis, full history, or individual rows
- **Fully Responsive** — Desktop, tablet & mobile with slide-in sidebar

---

## 📐 Formula

```
Step 1 → Sum all order queue numbers  (max 20 inputs)
Step 2 → Avg Orders  =  Sum ÷ 20
Step 3 → Seller Per Order (SPO)  =  Competition ÷ Avg Orders
```

### 🎯 Fiverr Criteria Table

| SPO Range   | Rating        | Advice                 |
|-------------|---------------|------------------------|
| 0 – 300     | 🟢 Excellent   | Create Gig Immediately |
| 300 – 600   | 🟩 Very Strong | High Potential         |
| 600 – 1200  | 🟡 Good        | Can Work               |
| 1200 – 2500 | 🟠 Medium      | Needs Strong SEO       |
| 2500 – 4000 | 🔴 Hard        | Avoid if Beginner      |
| 4000+       | ⛔ Very Hard   | Avoid                  |

---

## 🛠 Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Framework | React 19 + TypeScript            |
| Bundler   | Vite 8                           |
| Styling   | Tailwind CSS v4 + Inline Styles  |
| Charts    | Recharts                         |
| Icons     | Lucide React                     |
| Storage   | localStorage (no backend needed) |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/keyword-pulse.git

# Navigate to project
cd keyword-pulse

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── types.ts              # Shared TypeScript types
├── utils.ts              # Formula functions & style helpers
├── storage.ts            # localStorage read/write
├── hooks/
│   └── useIsMobile.ts    # Responsive breakpoint hook
├── components/
│   ├── Badge.tsx         # SPO criteria badge
│   ├── StatCard.tsx      # Metric display card
│   ├── KInput.tsx        # Styled input field
│   ├── NavItem.tsx       # Sidebar navigation button
│   └── RowMenu.tsx       # Three-dot row actions menu
├── pages/
│   ├── AnalyzerPage.tsx  # Main keyword analyzer + history table
│   ├── QueuePage.tsx     # Permanent order queue
│   ├── SavedPage.tsx     # Starred keywords
│   ├── MarketPage.tsx    # Market overview & stats
│   └── TrendsPage.tsx    # Charts & trend analysis
└── App.tsx               # App shell + navigation
```

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy on Vercel, Netlify, or any static host.

---

## 👤 Author

**Muhannad Munib Sajjad**
Designed & Developed with ❤️ for Fiverr freelancers.

---

## 📄 License

MIT — free to use and modify.
