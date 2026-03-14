# Store Screenshots — Project Standards

## Language Rules
- **Chat/explanations:** Turkish
- **Code comments:** English
- **Commit messages:** English (conventional commits format)
- **UI text:** English by default, i18n-ready

## Architecture

### Static-first
- `output: "export"` — no server-side code, pure static site
- All processing happens client-side (Canvas API)
- No database, no API routes, no backend

### Component Organization
- `components/Editor/` — Left panel: controls, settings, configuration
- `components/Preview/` — Right panel: live canvas preview
- `components/Upload/` — Image upload with drag & drop
- `components/ui/` — Reusable primitives (Button, ColorPicker, etc.)

### Device System
- Each device defined in `devices/` with: name, brand, category, screen dimensions, store spec, SVG frame path
- `devices/index.ts` exports the registry — single source of truth
- SVG frames stored in `devices/frames/` — one file per device
- Store screenshot specs (required sizes) in `lib/store-specs.ts`

### State Management
- React state + useReducer for editor state (no external state library)
- URL query params for shareable configurations (`lib/url-state.ts`)
- localStorage for saved templates

### Canvas Rendering
- `lib/canvas.ts` — Pure functions that take config and draw on canvas
- Device frame rendered as SVG → Image → Canvas
- Screenshot image composited inside device screen area
- Text rendered with loaded Google Fonts

## Conventions
- Functional components only, no class components
- Named exports (no default exports except pages)
- Tailwind for styling, no CSS modules
- `use` prefix for hooks
- Types in the same file unless shared, then in a `types.ts`

## Commands
```bash
npm run dev       # Dev server (turbopack)
npm run build     # Production static build
npm run lint      # ESLint
npm run typecheck # TypeScript check
```

## Commit Format
```
feat: add iPhone 16 Pro device frame
fix: canvas text alignment on small screens
docs: update device support table
```
