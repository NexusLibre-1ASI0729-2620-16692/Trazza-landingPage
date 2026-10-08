# Trazza Landing Page
Landing page for **Trazza**, a platform that connects carriers returning with free space to small and medium businesses (SMEs) that need to ship goods across Lima.

The site is a static, multilingual (EN/ES) marketing page whose goal is to drive sign-ups for two profiles:

- **Carriers** — fill their empty return trips with compatible loads.
- **Merchants** — ship goods without a fixed contract, at a lower cost than a dedicated trip.

---

## Project structure

```
.
├── index.html              # Landing page (main entry point)
├── registro.html           # Sign-up / login page (referenced by CTAs)
├── assets/
│   ├── styles/
│   │   └── style.css       # All styles (design tokens, layout, responsive)
│   ├── scripts/
│   │   ├── i18n.js         # EN/ES translation engine + language switcher
│   │   └── main.js         # UI behavior (menu, tabs, slider, video)
│   └── img/
│       ├── carrier-checking-loads.jpg
│       └── merchant-preparing-shipment.jpg
└── README.md
```

### Key files

| File | Responsibility |
|------|----------------|
| `index.html` | Semantic markup, SVG icon sprite, section anchors, `data-i18n` hooks |
| `assets/styles/style.css` | CSS variables (brand tokens), BEM-ish classes, responsive breakpoints |
| `assets/scripts/i18n.js` | Captures original EN copy, swaps to ES on demand, persists choice in `localStorage` |
| `assets/scripts/main.js` | Mobile burger menu, "How it works" tabs, testimonial slider, video embed |


---

## 🚀 Getting started

### Prerequisites

No build step, no dependencies. Any modern browser is enough.

Optionally, a simple static server to avoid `file://` quirks:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

### Quick start

```bash
git clone <repo-url>
cd Trazza-landingPage
# open index.html in your browser — that's it
```

### Language override via URL

You can force a language without touching the switch:

```
/index.html?lang=es
/registro.html?role=carrier&lang=es
```

Precedence order in `i18n.js`:

1. `?lang=` query param
2. `localStorage` (`trazza-lang`)
3. Fallback to `en`

---

## 🌐 Internationalization (EN / ES)

The site ships with a **zero-dependency i18n engine** in `assets/scripts/i18n.js`.

### How it works

- On first load, the script **captures the original English text** from the DOM and caches it in memory.
- When the user switches language, only the `es` dictionary is applied on top.
- Switching back to `en` restores the cached originals — no need to duplicate English strings in JS.
- The active language is persisted in `localStorage` under the key `trazza-lang`.
- Every `.lang-switch` on the page stays in sync automatically.

### Supported hooks in the HTML

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-i18n` | Replaces `textContent` | `<h2 data-i18n="how.title">` |
| `data-i18n-html` | Replaces `innerHTML` (allows `<br>`, `<span>`) | `<h1 data-i18n-html="hero.title">` |
| `data-i18n-attr` | Replaces one or more attributes | `data-i18n-attr="alt:carriers.photo"` |
| `data-i18n-attr` (multi) | Multiple attrs separated by `;` | `data-i18n-attr="content:meta.description;..."` |

### Adding a new string

1. Add the `data-i18n="my.key"` attribute in the HTML with the English text inline.
2. Add the Spanish translation to the `es` object in `i18n.js`:

```js
const es = {
  'my.key': 'Mi texto en español',
};
```

That's it — no other file needs to change.

### Exposed API

`i18n.js` exposes a small global for other scripts:

```js
window.TrazzaI18n.getLang();      // → 'en' | 'es'
window.TrazzaI18n.setLang('es');  // switches language + persists
window.TrazzaI18n.t('nav.plans'); // → 'Planes'
```

A `trazza:langchange` event is dispatched on `document` after every switch, so any component can re-render reactively.

---

## 🧩 Interactive components (`main.js`)

All behavior is progressive-enhancement friendly and scoped by data attributes.

| Component | Trigger | Data attributes |
|-----------|---------|-----------------|
| **Mobile burger menu** | `.burger-menu` click | `aria-expanded`, `.is-open`, `body.menu-open` |
| **"How it works" tabs** | Segmented control | `[data-segmented]`, `[data-panel]`, `[data-panel-group]` |
| **Auth role toggle** | Pill toggle on `registro.html` | `.toggle-container`, `.toggle-btn` |
| **Testimonials slider** | Horizontal scroll on mobile | `[data-slider]`, `[data-slider-dot]` |
| **Video embed** | Click on `.video-box` | Lazy-injects `<iframe>` from `data-video-src` |

### Auto role selection

`registro.html?role=merchant` automatically activates the merchant tab on page load:

```js
const role = new URLSearchParams(window.location.search).get('role');
if (role === 'merchant') document.getElementById('btn-emprendedor')?.click();
```

### Accessibility notes

- The burger updates its `aria-label` on language change.
- Tabs use `role="tab"` / `role="tabpanel"` with `aria-selected`.
- The video box is a `<button>` with a descriptive label.
- `Escape` closes the mobile menu.