# React Todo & Dynamic Form Builder

A production-quality React application with two independent features: a **Todo List** (API data, filtering, server-side pagination, URL-persisted state) and a **Dynamic Form Builder** (custom form schema builder + live preview + validation + submission).

---

## Live Demo

Run locally with `npm run dev` → [http://localhost:5173](http://localhost:5173)

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 19 (functional + hooks) | Required |
| Routing | React Router v7 | Client-side SPA routing; `useSearchParams` as primary filter state |
| Data fetching & caching | **TanStack Query v5** | Declarative fetching, automatic caching, background prefetch, devtools |
| Icons | **Lucide React** | Consistent, accessible SVG icon set — no emoji icons |
| Styling | CSS Modules | Scoped per-component, no class collisions |
| Build tool | Vite | Fast dev server, optimised production build |

---

## Features

### Todo List (`/todos`)

- **Server-side pagination** via JSONPlaceholder's `?_page` and `?_limit` query params — only the current page is fetched, not all 200 todos at once
- **Server-side filtering** — `?userId=X` and `?completed=true|false` are sent to the API, reducing payload on every filter change
- **Total count** from the `X-Total-Count` response header drives the pagination UI
- **Instant navigation** — the next page is prefetched in the background as soon as the current page loads, so "Next" clicks feel instantaneous
- **Stale-while-revalidate** — `placeholderData` keeps the previous page visible during refetch, eliminating loading flashes
- **Two-layer filter persistence**:
  - **URL query params** are the primary source of truth — filters are bookmarkable, shareable, and survive browser back/forward
  - **React Query in-memory cache** bridges state across in-app navigation (e.g. clicking a nav link and returning restores the last filters without a network round trip; clears on hard refresh)
- **Configurable page sizes** — 5 / 10 / 20 / 50 items per page
- **Smart ellipsis pagination** — first, last, prev, next, and surrounding pages with `…` where appropriate
- **Skeleton loading rows** on first fetch; pulsing dot indicator on background refetch
- Fully responsive on mobile, tablet, and desktop

### Dynamic Form Builder (`/form-builder`)

- Add, configure, and remove form fields dynamically
- **13 supported input types**: text, email, number, phone, URL, password, textarea, dropdown (select), checkbox group, radio group, date, time, range slider
- Per-field settings: label, placeholder, required validation, options list (select / checkbox / radio)
- Real-time sidebar summary — total fields, required count, labelled count
- **Saved to `localStorage`** — form schema persists across page refreshes
- "Save & Preview" navigates directly to the live preview

### Form Preview (`/form-preview`)

- Renders the saved form schema as a fully functional interactive form
- Required-field validation with inline error messages before submission
- On valid submit: prints structured data to the browser console and displays it on screen
- Reset clears all values without touching the saved schema
- "Fill Again" restores the blank form after submission

---

## Project Structure

```
src/
├── constants/
│   └── index.js                         # Shared constants: FORM_STORAGE_KEY, INPUT_TYPES,
│                                        #   OPTION_TYPES, PAGE_SIZE_OPTIONS, DEFAULT_FILTERS
│
├── utils/
│   └── todoUtils.js                     # parseParams() · buildParams() · formatPageRange()
│
├── hooks/
│   ├── useTodosQuery.js                 # TanStack Query hooks for the Todo List
│   │                                    #   - todoKeys    → structured query key factory
│   │                                    #   - fetchTodos  → API call with pagination + filters
│   │                                    #   - useTodosQuery() → placeholderData + next-page prefetch
│   │                                    #   - useUsersQuery() → 10-min staleTime
│   └── useFormBuilder.js                # Form schema CRUD + localStorage persistence
│
├── components/
│   ├── Navbar.jsx                       # Responsive nav with animated mobile hamburger drawer
│   │
│   ├── ui/                              # Shared, reusable UI primitives
│   │   ├── StatusBadge.jsx              # Completed / Pending badge with Lucide icons
│   │   ├── StatusBadge.module.css
│   │   └── SkeletonRow.jsx              # Shimmer skeleton row for table loading state
│   │
│   ├── todo/                            # Todo List sub-components
│   │   ├── TodoFilters.jsx              # User + status filter selects + clear button
│   │   ├── TodoStats.jsx                # Summary chips (page range, total, filters active)
│   │   ├── TodoTable.jsx                # Data table with loading / empty / error states
│   │   └── TodoPagination.jsx           # Smart pagination bar + page-size selector
│   │
│   ├── form-builder/                    # Form Builder sub-components
│   │   ├── FieldCard.jsx                # Single field editor (label, type, placeholder, required)
│   │   ├── OptionsEditor.jsx            # Options list for select / checkbox / radio fields
│   │   └── BuilderSidebar.jsx           # Sticky sidebar: actions + live form summary
│   │
│   └── form-preview/                    # Form Preview sub-components
│       ├── PreviewFormField.jsx         # Renders any of the 13 field types with validation state
│       └── SubmittedDataCard.jsx        # Success card displaying submitted key/value pairs
│
├── pages/
│   ├── TodoList.jsx                     # Todo page (~65 lines) — composes all todo sub-components
│   ├── FormBuilder.jsx                  # Builder page (~65 lines) — composes FieldCard + BuilderSidebar
│   └── FormPreview.jsx                  # Preview page (~120 lines) — composes PreviewFormField + SubmittedDataCard
│
├── styles/                              # One CSS Module per page/component
│   ├── Navbar.module.css
│   ├── TodoList.module.css
│   ├── FormBuilder.module.css
│   └── FormPreview.module.css
│
├── App.jsx                              # BrowserRouter + Routes + Navbar (no providers here)
├── main.jsx                             # QueryClient + QueryClientProvider + ReactQueryDevtools
└── index.css                            # Global reset + CSS custom properties (design tokens)
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run

```bash
git clone <your-repo-url>
cd react-app

npm install
npm run dev        # → http://localhost:5173
```

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production bundle locally
```

---

## Architecture & Design Decisions

### Component size limit — ≤ 200 lines per file

Every file is kept under 200 lines by extracting focused sub-components. Page components act as orchestrators: they own state and pass props down; presentational sub-components handle a single concern (rendering a table, a pagination bar, a field card, etc.). This keeps files readable, testable in isolation, and easy to change without touching unrelated code.

### URL query params as filter state (primary source of truth)

Filter values (user, status, page, limit) are stored in the URL via React Router's `useSearchParams`. This means:

- Filters survive browser back/forward navigation
- The filtered URL can be bookmarked or shared
- A page refresh restores the exact filter state without any extra persistence layer

The `parseParams` / `buildParams` helpers in `utils/todoUtils.js` convert between raw URL strings and typed filter objects, keeping that logic out of the page component.

### React Query cache as a navigation bridge

When the user navigates away (e.g. clicks "Form Builder" in the nav) and then returns to the Todo List, the URL params are gone. To restore the last-used filters automatically, the page writes the current filter state into a dedicated React Query cache key (`todoKeys.lastFilters()`) on every change. On mount it checks: if the URL has no params, restore from the cache. This cache is in-memory and clears on hard refresh — intentional, since a true refresh should use the URL.

### TanStack Query v5 — global configuration

`QueryClient` is created once in `main.jsx` with sensible production defaults:

```js
staleTime: 60_000      // 1 min — avoids redundant refetches on tab focus
gcTime:    300_000     // 5 min — keeps unused cache entries around for fast back-navigation
retry: 2               // retry failed requests twice before showing an error
refetchOnWindowFocus: false  // prevents surprise refetches in demos / presentations
```

### Server-side pagination

JSONPlaceholder supports `?_page=N&_limit=N` and returns an `X-Total-Count` header. The app uses this to:

1. Fetch only the current page — not all 200 records
2. Calculate `totalPages = Math.ceil(totalCount / limit)` for the pagination UI
3. Combine with filters: `?_page=2&_limit=10&userId=3&completed=false`

Next-page prefetch (`queryClient.prefetchQuery`) is triggered in a `useEffect` every time the current page resolves, so the next page is usually already cached when the user clicks "Next".

### Constants & utils — single source of truth

`src/constants/index.js` exports all shared constants (`INPUT_TYPES`, `OPTION_TYPES`, `PAGE_SIZE_OPTIONS`, `DEFAULT_FILTERS`, `FORM_STORAGE_KEY`). Hook and component files import from there rather than defining their own copies, so a change to — for example — the list of supported input types is a one-line edit in one file.

### CSS Modules + design tokens

All colours, radii, shadows, and spacing are CSS custom properties in `index.css`. Every CSS Module references tokens (`var(--primary)`, `var(--border)`, etc.) rather than hardcoded values, so a theme change is a single-file edit. Touch-friendly sizing (`min-height: 44px` on interactive elements, `font-size: 16px` on inputs to prevent iOS zoom) is baked into every component's styles.

### Responsive design

The app is fully responsive from 320 px to desktop:

| Breakpoint | Behaviour |
|---|---|
| ≤ 768 px | Navbar collapses to hamburger → animated slide-down drawer; filters stack vertically |
| ≤ 960 px | Form Builder sidebar moves above the field list and reflows as a horizontal action bar |
| ≤ 600 px | Todo table scrolls horizontally (min-width: 560 px); pagination stacks; form footer buttons go full-width |
| ≤ 400 px | Font sizes scale down; back button shrinks |

---

## API Reference

Base URL: `https://jsonplaceholder.typicode.com`

| Endpoint | Params | Usage |
|---|---|---|
| `GET /todos` | `_page`, `_limit`, `userId`, `completed` | Paginated, filtered todos; `X-Total-Count` header gives total |
| `GET /users` | — | All 10 users — populates filter dropdown and maps user IDs to names |

---

## Routes

| Path | Page |
|---|---|
| `/` | Redirects to `/todos` |
| `/todos` | Todo List |
| `/form-builder` | Dynamic Form Builder |
| `/form-preview` | Form Preview & Submit |
