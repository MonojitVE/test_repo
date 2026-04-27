# Proposal Generator — Frontend

React + CSS frontend for the VirtualEmployee Proposal Generator backend.

## Tech stack
- **React 18** with React Router v6
- **Vite** dev server (port 5173)
- **Pure CSS** — no component library, CSS variables for theming
- **DM Serif Display** (headings) + **DM Sans** (body) + **JetBrains Mono** (code/labels)

---

## Project structure

```
src/
├── pages/
│   ├── HomePage.jsx / .css        ← Landing page with features & CTA
│   ├── GeneratorPage.jsx / .css   ← Form + loader (two-column layout)
│   └── ProposalPage.jsx / .css    ← Viewer + editor + download
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx / .css      ← Sticky top nav
│   │   └── PageShell.jsx / .css   ← Page wrapper with max-width
│   │
│   ├── ui/
│   │   ├── Button.jsx / .css      ← Reusable button (4 variants, 3 sizes)
│   │   ├── FormField.jsx / .css   ← input / textarea / select field
│   │   └── Badge.jsx / .css       ← Small status badge
│   │
│   └── proposal/
│       ├── ProposalForm.jsx / .css      ← 3-section form
│       ├── GenerationLoader.jsx / .css  ← Animated step progress
│       ├── ProposalViewer.jsx / .css    ← Renders plain text as styled doc
│       └── ProposalToolbar.jsx / .css   ← Action bar (copy/edit/pdf)
│
├── hooks/
│   └── useProposal.js             ← All state + API orchestration
│
├── services/
│   └── api.js                     ← generateProposal(), downloadProposalPdf()
│
└── styles/
    └── global.css                 ← CSS variables + reset
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API URL
```bash
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL (default: http://localhost:8000)
```

### 3. Start dev server
```bash
npm run dev
# → http://localhost:5173
```

### 4. Make sure your FastAPI backend is running
```bash
# In your backend folder:
uvicorn app:app --reload --port 8000
```

---

## Routes

| Route        | Page            | Description                              |
|--------------|-----------------|------------------------------------------|
| `/`          | HomePage        | Landing page with features overview      |
| `/generate`  | GeneratorPage   | Form input + live generation loader      |
| `/proposal`  | ProposalPage    | Proposal viewer, editor, PDF download    |

---

## API integration

All calls go through `src/services/api.js`:

| Function               | Method | Endpoint         | Purpose             |
|------------------------|--------|------------------|---------------------|
| `generateProposal()`   | POST   | `/generate`      | Generate proposal   |
| `downloadProposalPdf()`| POST   | `/download-pdf`  | Get PDF blob        |
| `triggerDownload()`    | —      | —                | Save blob as file   |

---

## Customization

- **Colors / fonts** → `src/styles/global.css` CSS variables
- **API URL** → `.env` → `VITE_API_URL`
- **Project type options** → `ProposalForm.jsx` (PROJECT_TYPES, INDUSTRIES, etc.)
- **Loading step messages** → `useProposal.js` (GENERATION_STEPS array)
- **Proposal section parsing** → `ProposalViewer.jsx` (HEADING_PATTERNS)

---

## Build for production

```bash
npm run build
# Output → dist/
```
