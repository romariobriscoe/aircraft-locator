# Cirrus Fleet · Operational Registry — version 3

Drop this whole folder into the repo as `version-3/` and GitHub Pages will serve it at
`/aircraft-locator/version-3/` with zero build tooling.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell — pinned CDN dependencies, links the CSS and JS |
| `styles.css` | All styling (was inline in v2) |
| `app.js` | The entire app as plain precompiled-style JS — **no JSX, no Babel** |

## What changed vs version 2

**Performance**
- Removed `@babel/standalone` and in-browser JSX compilation entirely. v2 shipped ~3 MB of
  compiler and recompiled the app on every page load; v3 runs immediately. `app.js` uses
  `h()` (`React.createElement`) directly.
- CSS/JS split out of the single 163 KB HTML file so the browser can cache them.
- All CDN dependencies pinned to exact versions (`react@18.3.1`, `react-dom@18.3.1`,
  `leaflet@1.9.4`, `papaparse@5.4.1`, `xlsx@0.18.5`).

**Airports — global public directory**
- Every airport code in an upload is now resolved against a worldwide public dataset
  (github.com/mwgg/Airports, ~28k airports; OurAirports CSV as automatic backup, which also
  covers tiny US GA fields). The dataset is fetched lazily — only when an upload contains a
  code the built-in featured-bases list doesn't know — and resolved airports are saved with
  the registry, so the download usually happens once per browser.
- The curated list in `app.js` (`AIRPORT_DB`) remains as the featured-bases + **FBO directory**.
  Note: there is no public/free worldwide FBO dataset, so FBO names come from your upload's
  `facility_name` column, or from `AIRPORT_DB` for the curated bases. Add rows there to
  enrich more bases with FBO names.
- Uploads are no longer silently filtered: an "Upload notes" report lists skipped rows and
  any codes that couldn't be resolved.

**Persistence & privacy**
- The registry, filters, watched tails and layer toggles persist in `localStorage`
  (`cirrus-fleet-registry-v3`) — a refresh no longer loses everything.
- Visible privacy note in the upload card ("processed entirely in your browser") with a
  one-click **Clear saved data** button.

**Map**
- Dependency-free clustering of active-base markers at zoom < 7 (dark bubble = summed
  owners, small blue badge = number of bases; click to zoom). The selected base never
  clusters. Implemented in `clusterAirports()` — no extra CDN plugin.
- "Updated Xs ago" data-age pill for the live ADS-B layer (turns amber when > 60 s stale).

**Mobile**
- The sidebar is a slide-in drawer (hamburger in the top bar) under 720 px instead of
  `display: none` — upload, search, and the base list now work on phones.

**Accessibility**
- `--text-3` darkened to `#6b6e71` (WCAG AA on white); brand gray kept as `--brand-gray`.
- `:focus-visible` outlines, `aria-label`/`aria-pressed`/`aria-expanded` on icon buttons and
  toggles, `role="status"` live toast, Esc closes menu → panel → drawer,
  `prefers-reduced-motion` disables the pulse animations.
- Smallest popup label sizes bumped (8–8.5 px → 9–9.5 px).

**Bug fixes**
- `.cirrus-ac-popup__stats` referenced undefined `var(--line-1)` — its dividers never
  rendered. Now `var(--line)`.
- Duplicated CORS-proxy lists (ADS-B vs METAR) merged into one `CORS_STRATEGIES`.
- Empty spreadsheet rows no longer count as "invalid rows".
- Removed dead CSS sections (empty "Globe view" / "Responsive tuning" headers).

## Editing

Everything lives in `app.js`, organized top-down: icons → airport data → global directory
fetcher → persistence → main component (state → memos → effects → handlers → render) →
sub-components. UI is `h('div', {props}, ...children)` instead of JSX — same structure,
no compile step needed after edits.

## Adding SRI hashes (optional hardening)

Leaflet ships with its official integrity hash. For the others, generate and add
`integrity="sha384-…" crossorigin="anonymous"`:

```sh
curl -s https://unpkg.com/react@18.3.1/umd/react.production.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

(Repeat per script URL in `index.html`.)
