# FormCraft — Form Builder SPA

A production-quality form builder single-page application (Google Forms clone). Design form templates with drag-and-drop, fill them out with live validation, and export submissions as PDF. All data persisted in localStorage — no backend required.

## Features

- **Builder mode** — 3-panel layout: field palette, drag-and-drop canvas, config panel
- **9 field types** — Short text, long text, number, date, single select, multi select, file upload, section header, calculation
- **Conditional logic** — Show/hide fields or toggle required based on other field values
- **Calculated fields** — Sum, average, min, max across number fields
- **Fill mode** — Live validation, condition-driven visibility, submission to localStorage
- **PDF export** — Browser-native print API (no third-party libs)
- **Submissions list** — View, re-download PDF, delete past submissions
- **Responsive** — Mobile panel toggles in builder, scrollable tables, stacked layouts

## Tech Stack

| Layer        | Choice                                                         |
| ------------ | -------------------------------------------------------------- |
| Framework    | React 19 + TypeScript 6                                        |
| Build        | Vite 8 with manual chunk splitting                             |
| Styling      | Tailwind CSS 4 (JIT via `@tailwindcss/vite`)                   |
| State        | Zustand (selective subscriptions)                              |
| Routing      | React Router 7 (library mode) with `React.lazy` code splitting |
| Drag & Drop  | @dnd-kit (core + sortable)                                     |
| Persistence  | localStorage (typed wrapper)                                   |
| CI           | GitHub Actions (lint, typecheck, build)                        |
| Code Quality | ESLint + Prettier + Husky pre-commit hooks                     |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/        # Shared UI (Layout, ConfirmDialog)
├── features/
│   ├── builder/       # Builder mode (layout, canvas, field palette, config panel)
│   │   ├── components/  # CanvasField, SortableItem, PreviewOverlay
│   │   └── configs/     # Per-field-type config editors
│   ├── fill/          # Fill mode (FillLayout)
│   │   └── renderers/   # Per-field-type form renderers
│   └── templates/     # Templates list
├── lib/               # Pure logic (validation, conditions, calculations, storage, pdf-export)
├── pages/             # Route-level pages (lazy loaded)
├── stores/            # Zustand stores (builder, fill, template)
└── types/             # TypeScript types (fields, template)
```

## Architecture Decisions

- **No backend** — All state in localStorage via a typed wrapper. Templates and instances stored as JSON.
- **Discriminated unions** for field types — Each field type has its own interface, narrowed by `type` in switch statements. No `any`.
- **Condition evaluation** is pure — `resolveFieldState()` computes visibility and required state from field conditions + current values.
- **PDF export** uses a hidden iframe + `window.print()` — zero dependencies, works in all browsers.
- **One component per file** — No co-located components. Each config and renderer in its own file.
- **Code splitting** — Every page is `React.lazy`. Vendor chunks for React, dnd-kit, and Zustand.

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
]);
````
