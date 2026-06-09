# Aurora — Animated Login & Signup

An advanced, motion-rich authentication experience built with the **latest** web stack.
Every interaction is choreographed — from input underline draw-ins to a liquid submit
button morph — to feel deliberate, premium and lightning fast.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19.2)
- **React 19** with new transition primitives
- **TypeScript 5** (strict)
- **Tailwind CSS v4** (`@theme` token system, OKLCH palette, no config file)
- **Framer Motion 12** for choreography
- **Zustand 5** for state, persisted to **localStorage**
- **Zod** for schema validation
- **next-themes** with `prefers-color-scheme` dark mode
- **Radix UI** primitives (Switch, Checkbox, Label) wrapped in shadcn-style
- **Sonner** toasts, **Lucide** icons

## Features

- Login, Signup, Forgot Password, **6-digit OTP** flow
- Animated **Form morph** between Login / Signup / Forgot panels
- **3D Tilt card** with mouse-tracked parallax gradient
- **Curtain reveal** page intro
- **Submit button** morphs idle → loading liquid → checkmark + confetti
- **Floating label** with center-out underline draw
- **Password strength** meter with live checklist
- **Magnetic** nav buttons, animated arrows
- **Route transitions** (blur + translate)
- **Dashboard** with stats, recent members, quick actions
- **People** page with full CRUD (add / remove)
- **Profile** editor with inline validation
- **Settings**: theme switcher, reduce-motion, export JSON, wipe workspace
- **Dark mode** (system / light / dark) with smooth transitions
- **Reduced motion** support (CSS + runtime toggle)
- **Responsive** mobile sidebar, tablet, desktop brand panel
- **Accessible**: focus rings, ARIA, keyboard nav, semantic HTML

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

### Demo credentials

| Email             | Password   |
| ----------------- | ---------- |
| `demo@aurora.app` | `demo1234` |
| `ada@aurora.app`  | `demo1234` |
| `grace@aurora.app`| `demo1234` |

> **All data lives in your browser's localStorage.** Nothing is sent anywhere.
> Clear it from Settings → Wipe workspace, or via DevTools.

## Scripts

| Command            | What it does                       |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start dev server (Turbopack)       |
| `npm run build`    | Production build                   |
| `npm run start`    | Run production build               |
| `npm run lint`     | ESLint (Next + React 19 rules)     |
| `npm run typecheck`| `tsc --noEmit`                     |

## Project shape

```
src/
  app/                     # routes
    page.tsx               # /  → auth orchestrator
    dashboard/             # /dashboard, /users, /settings, /profile
    layout.tsx, globals.css
  components/
    auth/      FormField, PasswordInput, SubmitButton, OTPInput, AuthShell, LoginForm, ...
    motion/    TiltCard, Magnetic, Curtain, PageTransition, Confetti, AnimatedCheck
    ui/        Button, Switch, Checkbox, Avatar, Label, Sonner
  lib/         storage, store, auth, validation, utils
  hooks/       use-mounted, use-db-sync
  proxy.ts                # dashboard matcher
```

## License

MIT — do whatever you'd like.
