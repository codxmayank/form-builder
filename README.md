# Form Builder SPA

A Google Forms-style form builder. Design templates with drag-and-drop, fill them out with live validation, export as PDF. No backend — everything is stored in localStorage.

## Running Locally

Needs Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev          # localhost:5173
```

```bash
pnpm typecheck    # type check (no emit)
pnpm lint         # ESLint
pnpm format       # Prettier auto-fix
pnpm build        # production build
pnpm preview      # preview production build
```

Pre-commit hook runs format + lint + typecheck automatically via Husky.

## Tech Stack

| Layer        | Choice                                       |
| ------------ | -------------------------------------------- |
| Framework    | React 19 + TypeScript 6                      |
| Build        | Vite 8 (manual chunk splitting)              |
| Styling      | Tailwind CSS 4 (`@tailwindcss/vite`)         |
| State        | Zustand                                      |
| Routing      | React Router 7 + `React.lazy` code splitting |
| Drag & Drop  | @dnd-kit (core + sortable)                   |
| Persistence  | localStorage                                 |
| CI           | GitHub Actions (lint → typecheck → build)    |
| Code Quality | ESLint + Prettier + Husky                    |

## Project Structure

```
src/
├── components/              # Shared UI — Layout, ConfirmDialog, ThemeToggle, Toast
├── constants/               # App-wide constants
├── hooks/                   # Shared custom hooks
├── features/
│   ├── builder/             # Builder mode (3-panel layout)
│   │   ├── BuilderLayout.tsx
│   │   ├── BuilderCanvas.tsx
│   │   ├── ConfigPanel.tsx
│   │   ├── FieldPalette.tsx
│   │   ├── components/      # CanvasField, SortableItem, PreviewOverlay
│   │   ├── configs/         # One config editor per field type + ConditionEditor
│   │   └── hooks/           # Builder-specific hooks
│   ├── fill/                # Fill mode
│   │   ├── FillLayout.tsx
│   │   ├── components/      # Fill-specific components
│   │   ├── renderers/       # One renderer per field type (8 files)
│   │   └── hooks/           # Fill-specific hooks
│   ├── instances/           # Submitted responses feature
│   └── templates/           # Templates list (home page)
├── lib/                     # Pure logic — no React, no side effects
│   ├── calculations.ts      # Sum, average, min, max aggregations
│   ├── conditions.ts        # Condition evaluation + visibility resolution
│   ├── pdf-export.ts        # HTML generation for browser print-to-PDF
│   ├── storage.ts           # Typed localStorage wrapper
│   └── validation.ts        # Per-field-type validation rules
├── pages/                   # Route pages (all lazy loaded)
│   ├── HomePage.tsx
│   ├── BuilderPage.tsx
│   ├── FillPage.tsx
│   ├── InstancesPage.tsx
│   └── SuccessPage.tsx
├── stores/                  # Zustand stores
│   ├── builder-store.ts     # Builder state (fields, selection, mutations)
│   ├── fill-store.ts        # Fill state (values, errors, init)
│   ├── template-store.ts    # Template CRUD
│   └── theme-store.ts       # Dark/light/system theme
├── types/
│   ├── fields.ts            # Discriminated union of 9 field types
│   └── template.ts          # FormTemplate, FormInstance, FieldValue
└── router.tsx               # Route config with lazy loading
```

## localStorage Schema

Three keys total:

| Key                      | Shape                           | What it stores                     |
| ------------------------ | ------------------------------- | ---------------------------------- |
| `form-builder:templates` | `FormTemplate[]`                | All form templates + field configs |
| `form-builder:instances` | `FormInstance[]`                | Submitted responses by templateId  |
| `form-builder:theme`     | `'light' \| 'dark' \| 'system'` | Theme preference                   |

### Why this shape

Two flat arrays — templates and instances. Instances reference templates via `templateId`, that's the only relationship. No need for normalized tables or IndexedDB.

Templates embed their fields directly — fully self-contained, no joins needed. Form values are a flat `Record<fieldId, FieldValue>` since sections are visual-only. File uploads are metadata-only per spec.

## Architecture Decisions

### Field types as a discriminated union

`FormField` is a union of 9 types discriminated by `field.type`. Switch on it, TS narrows — no casts, no `any`. Non-input fields (section headers, calculations) are excluded via `Exclude<>` to get `InputField` for validation.

### Conditions

Condition = target field + operator + value + effect (show / hide / mark required / mark not required). `resolveFieldState()` takes a field + current values, returns `{ visible, required }`. Pure function.

- **OR semantics** — any matching condition fires its effect. Last match wins on conflicts.
- **Visibility inferred** — "show" conditions start the field hidden, "hide" conditions start it visible. Falls back to `defaultVisibility` only when there's no show/hide condition.
- **Hidden fields excluded** from validation and PDF output.

### State management

Zustand — no providers, no context. Separate stores for builder and fill. Selective subscriptions (`useBuilderStore(s => s.fields)`) keep re-renders scoped.

### PDF export

Hidden iframe + `window.print()`. Standalone HTML with inline styles, resolves option IDs to labels. Browser print API handles page breaks and paper sizes for free — no bundle cost vs jsPDF/react-pdf.

### Adding a new field type

Create `{Type}Config.tsx` + `{Type}Renderer.tsx`, add the type to the union in `fields.ts`, add switch cases in `ConfigPanel` and `FillLayout`. No existing components change.

### Code splitting

Every page is lazy loaded. Vite splits vendor chunks (React, dnd-kit, Zustand) separately.

## Tech and Product Decisions

### Product Thinking (Beyond the Spec)

Things I built that weren't in the exercise but felt necessary for a real product:

- **Performance improvements** — With Code splitting + chunk optimization — Every page lazy loaded via `React.lazy`. Vendor code split into separate chunks (React, dnd-kit, Zustand) so returning users only re-download what changed.
- **Mobile responsive builder** — The 3-panel builder collapses into toggleable panels on smaller screens. Fill mode, templates list, and responses page are all responsive too.
- **CI pipeline** — GitHub Actions runs lint → typecheck → build on every push. Husky pre-commit hook catches issues locally before they hit CI.
- **Dark / light / system theme** — persisted in localStorage, respects OS preference via `prefers-color-scheme`, toggleable from the header. Tailwind 4's `@custom-variant` handles the CSS.
- **SEO basics** — Meta tags, semantic HTML, `robots.txt`.
- **Toast notifications** — Success/error feedback on save, submit, and export.
- **Confirm dialogs** — Destructive actions (delete template, delete response) require confirmation.
- **Bulk PDF export** — Export all submissions for a template at once from the responses page.
- **Error Boundaries** — Fallback 404 pages to handle cases when wrong URL is entered and guide user to go to correct page (homepage)

### Component design

- Adding an 11th field type means creating two new files (a config editor and a renderer), adding the type definition, and dropping in a couple of switch cases.
- Four existing files get a one-liner each — no existing config or renderer needs changes.
- Validation, conditions, and PDF export all handle new types through the same switch structure.

### Conditional logic correctness

1. Chained conditions work — if field A controls B and B controls C, changing A cascades through the chain correctly because each field's visibility is resolved against the current form state.

2. A field can be both required and conditionally hidden. When hidden, it's skipped during validation and excluded from the PDF — no ghost errors, no phantom data.

3. Conditions evaluate in real-time as the user types, not just on submit. And a field can't reference itself in a condition — the target dropdown filters it out.

### Type safety

- Types drive the architecture, not the other way around. `FormField` is a discriminated union — switch on the type and TS narrows to the exact variant, so each config editor and renderer works with its specific field type, not some generic shape.

- Condition operators are typed per field type too — the UI only shows operators that make sense for the target field (text gets "contains", numbers get "greater than", dates get "before/after").

- There's no `any` anywhere. `FieldValue` is a proper union covering every field type's output. `exactOptionalPropertyTypes` is on in tsconfig so optional props can't sneak in `undefined`.

### PDF export quality

The PDF looks like a real form export — title, timestamp, fields in order with proper labels and formatted values. Select fields show the option name, not a UUID. File uploads list filenames. Hidden fields are excluded. Section headers show as visual dividers.

It's all inline CSS — no dependency on Tailwind or the app being loaded. The browser print dialog handles paper size and margins, so the user stays in control.

## Future improvements

- **App Performance** — App is currently performant and fast with techniques implemented like code splitting and lazy loading, etc. We can still check on performance optimizations including Web Vitals (CWV) and related parameters.
- **Service worker + PWA** — Offline support so forms can be filled without network. Cache the app shell, sync submissions when back online.
- **SEO** — SEO optimizations for the app based on real life product features and requirements.
- **Tests** — `lib/` functions are pure and very testable. Vitest for units, Playwright for E2E flows.
- **Undo/redo** — No way to undo field deletion or config changes.
- **Deeper a11y audit** — Basic ARIA is there but needs a proper screen reader and keyboard-only pass.
- **Field presets** — Reusable field configs like "Email" (single-line text + placeholder + pattern) or "Event Date" (date + prefill today + min date) to speed up template creation.
- **Form versioning** — Editing a template after submissions exist can break old responses. Snapshot the template at submission time.
- **Real file storage** — Currently metadata only. A backend could store actual files and embed them in PDFs.
