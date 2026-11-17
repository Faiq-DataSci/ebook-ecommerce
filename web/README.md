# Web Admin (React)

The **web admin** interface of the e‑book e‑commerce project is a single‑page application built with **React**, **TypeScript**, and **Vite**. It follows a neo‑brutalist design language (three intensity zones) and communicates with the backend API for data management.

## Tech Stack
- **React** – UI library
- **TypeScript** – static typing
- **Vite** – fast development server & bundler
- **Zod** – schema validation for form data
- **React Router** – client‑side routing
- **Axios** – HTTP client (wrapped with JWT handling)
- **Tailwind CSS** – utility‑first styling (used to implement neo‑brutalism)

## Project Structure
```
web/
├─ src/                 # Source files
│   ├─ components/     # Reusable UI components (buttons, cards, etc.)
│   ├─ pages/          # Route pages (Dashboard, Products, Orders, ...)
│   ├─ hooks/          # Custom React hooks (auth, data fetching)
│   ├─ utils/          # Helpers like API client, validation
│   ├─ App.tsx         # Root component
│   └─ main.tsx        # Entry point, Vite bootstrap
├─ public/               # Static assets (favicon, logo)
├─ index.html            # HTML template used by Vite
├─ vite.config.ts        # Vite configuration (ESM, plugins)
├─ tsconfig.json        # TypeScript configuration
├─ tailwind.config.ts    # Tailwind configuration
└─ README.md            # <‑ you are reading this
```

## Setup
1. **Install dependencies**
   ```powershell
   cd web
   npm ci
   ```
2. **Start development server**
   ```powershell
   npm run dev
   ```
   The app will be available at `http://localhost:5173` and proxies API requests to the backend (configured in `vite.config.ts`).
3. **Build for production**
   ```powershell
   npm run build
   ```
   The compiled assets are placed in `dist/` and can be served by any static file server.

## Testing
```powershell
npm test   # runs Vitest tests for React components
```

## Design Guidelines (Neo‑Brutalism)
- **Three intensity zones**: low‑contrast background, medium‑contrast cards, high‑contrast call‑to‑action elements.
- Use solid colors, sharp edges, and minimal shadows.
- Typography follows a bold‑sans style with large headings.

---
*All admin UI actions are protected by JWT‑based role checks enforced by the backend; the UI only hides or shows menu items but never bypasses server‑side authorization.*
