# CHANGELOG — POVC

All notable changes to this project are documented here.

---

## [3.0.0-FINAL] — 2025-07-26 — v1.0 Public Release

### Added
- Complete SEO meta tags (Open Graph, Twitter Cards, canonical URL)
- Web app manifest (manifest.json) for PWA support
- Inline SVG favicon
- `prefers-reduced-motion` support — particles, scanlines, glitch disabled for accessibility
- Active navigation link highlighting on scroll (IntersectionObserver)
- Skip-to-content link for keyboard users
- `aria-labelledby` on all section headings
- `role="progressbar"` with proper `aria-valuenow/min/max` on all bars
- `role="list"/"listitem"` on all grids and cards
- `<dl>/<dt>/<dd>` semantic markup on identity card stats
- Print stylesheet
- Cross-browser CSS: `@supports` fallback for `backdrop-filter`
- Cross-browser CSS: explicit `mask` (non-webkit) on card glow
- `rel="me"` on social links (social graph verification)
- `scroll-margin-top` for proper anchor offset with fixed nav
- Font `display: swap` for performance
- `defer` attribute on all scripts
- Contact terminal response lines animate on scroll entry
- README.md and CHANGELOG.md

### Fixed
- Inline `style=` attribute removed from Vishnu AI V.Force card title → uses `.card-title-accent` class
- GSAP `body { cursor: none }` now only applies when not `prefers-reduced-motion`
- Loader `aria-valuenow` updates with progress
- Build version updated from `v2.4.1-STABLE` to `v3.0.0-FINAL`
- Copyright year corrected to 2025
- Canonical URL placeholder added

### Changed
- About bio: more natural, human tone — removed generic AI phrasing
- Project descriptions: conversational rewrites across all three cards
- Achievement descriptions: specific and honest, no inflated language
- Sprint milestone descriptions: plain English, no jargon padding
- Quick facts: tightened and made more personal
- Contact terminal closing line: updated to reflect real intent
- Life log comments: short, honest, personal

### Content Review — Human Language Pass
- "Built for elderly independence and safety" → actual description of what it does
- "National-level academic excellence" → "Competed and medalled through multiple rounds"
- "Operational sprint log — objectives plotted, progress vectored" → plain English
- All section descriptions reviewed and rewritten where needed

---

## [2.4.1-STABLE] — 2025-07-26

### Added
- Life Journey Level Log (Sector 06) — RPG system Class 6 → MIT → Career
- Vishnu AI Dev Log (Sector 04) — 4 phase cards with V.Force power bar
- About section with identity card and bio
- Skills section with animated progress bars
- Achievements section with stat counters
- Contact section with LinkedIn, GitHub, Email + terminal

---

## [1.0.0] — 2025-07-26

### Initial Release
- Hero section with particle canvas, glitch animation, typing terminal
- Loading screen with animated progress
- F1 Telemetry Hub — Nürburgring lap data
- Sprint Milestone Tracker — vertical timeline
- Custom cursor (dot + trailing ring)
- Scroll progress bar
- GSAP ScrollTrigger animations throughout
- Fully responsive (mobile, tablet, desktop, ultra-wide)
- Dark cyber-telemetry cockpit theme
