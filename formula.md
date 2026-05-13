# Fiverr Keyword Research Tool — UI Improvements & Fixes

## Main Issues To Fix

### 1. Table Heading Visibility
- Column headings are hard to read
- Increase font size
- Make headings bold
- Add better contrast
- Sticky table header

### 2. Formula Correction
Current formula is wrong.

Correct logic:

1. User adds maximum 20 order queue numbers
2. Sum all numbers
3. Divide total by 20
4. Then calculate Seller Per Order

---

# Correct Formula

## Step 1 — Total Orders

```txt
2 + 3 + 4 + 2 + ...
```

Maximum inputs allowed = 20

---

## Step 2 — Average Orders

:contentReference[oaicite:0]{index=0}

Example:

```txt
Total Sum = 100
100 / 20 = 5
```

---

## Step 3 — Seller Per Order

:contentReference[oaicite:1]{index=1}

Example:

```txt
Competition = 10000
Average Orders = 5

10000 / 5 = 2000
```

---

# Required UI Improvements

## Font & Typography
- Increase overall font size
- Use modern font:
  - Inter
  - Poppins
  - Satoshi
  - Manrope
- Bold headings
- Better spacing

---

# Dark & Light Theme

## Add Theme Toggle Button

```txt
🌙 Dark Mode
☀️ Light Mode
```

Requirements:
- Save selected theme in local storage
- Smooth transition animation

---

# New Analysis Button Fix

Current issue:
- Button not working

Fix:
- Clear all inputs
- Reset calculations
- Reset order fields
- Start fresh analysis

Button:

```txt
[ + New Analysis ]
```

---

# Orders Input Rules

## Requirements
- Maximum 20 inputs only
- Auto-add "+" sign
- Empty values ignored
- Auto total calculation
- Show remaining slots

Example:

```txt
Orders Added: 14 / 20
```

---

# Analysis History Improvements

## Add Filter System

Filters:
- Highest Competition
- Lowest Seller Per Order
- Recent Analysis
- Keyword Search

Search bar:

```txt
[ Search Keyword ]
```

---

# Three Dots Menu Fix

Current issue:
- Three dots menu not working

Fix menu options:

```txt
⋮
- Edit
- Delete
- Duplicate
- Export Single Row
```

Add smooth dropdown animation.

---

# Trend Graph Improvements

Current graph looks bad.

## Use Better Library

Install:

```bash
npm install recharts
```

OR

```bash
npm install apexcharts react-apexcharts
```

Recommended:
- ApexCharts for modern UI

---

# Graph Design

Graph should show:
- Competition trend
- Seller Per Order trend
- Keyword performance

Add:
- Smooth curves
- Hover tooltip
- Gradient effect
- Glassmorphism cards

---

# Better Dashboard Layout

## Top Navbar

```txt
------------------------------------------------
Logo
Search
Theme Toggle
Export CSV
------------------------------------------------
```

---

# Dashboard Cards

Use attractive cards with glow effect.

Cards:
- Competition
- Average Orders
- Seller Per Order
- Total Analyses

---

# Table UI Improvements

## Improve readability
- Bold headings
- Alternate row colors
- Hover effect
- Rounded corners
- Better padding

---

# Recommended Colors

## Dark Theme

Background:
```txt
#0F172A
```

Cards:
```txt
#1E293B
```

Accent:
```txt
#3B82F6
```

---

# Recommended Libraries

## UI

```bash
npm install framer-motion
npm install lucide-react
npm install recharts
npm install react-hot-toast
npm install clsx
```

---

# Responsive Design

## Desktop
- Sidebar
- Wide charts
- Full table

## Mobile
- Stack cards vertically
- Horizontal table scroll
- Bigger touch inputs

---

# Local Storage

Storage key:

```js
fiverr_keyword_research_data
```

Theme key:

```js
fiverr_theme
```

---

# Final UI Feel
The app should feel like:
- Modern SaaS dashboard
- Trading analytics panel
- Fiverr research pro tool
- Clean & premium interface

NOT like a basic calculator app.