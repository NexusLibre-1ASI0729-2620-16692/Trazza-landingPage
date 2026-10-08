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