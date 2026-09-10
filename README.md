# Gemstone Hero — Veda Structure

A fresh, standalone React + Vite + Tailwind CSS project containing the
GemstoneHero section, ready to run on its own and later merge into the
existing Veda Structure codebase.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL to preview the hero section.

## What's here

- `src/components/GemstoneHero.jsx` — the actual deliverable. Self-contained,
  scoped class names (`gemstone-hero`, `gemstone-hero__*`), no global styles
  touched, fully configurable via props (see below).
- `src/App.jsx` — a thin demo shell with placeholder bars standing in for the
  real Veda Structure header/footer, just so you can preview the section in
  context. **Delete this when merging** — only `GemstoneHero.jsx` is meant to
  ship into the real site, dropped in directly beneath the existing header.
- Tailwind CSS is already configured (`tailwind.config.js`, `postcss.config.js`,
  `src/index.css`) using only core utility classes (including arbitrary-value
  hex colors, e.g. `bg-[#E9A331]`) — no custom Tailwind plugins required.

## Props (all optional)

| Prop | Default | Purpose |
|---|---|---|
| `eyebrow` | "Vedic Gemstone Collection" | Small label above the heading |
| `title` | "Discover the Right Gemstone for Your Journey" | H1 |
| `description` | PDF subheading copy | Supporting paragraph |
| `primaryCta` | `{ label: "Explore Gemstones", href: "#" }` | Shopify gemstones collection URL |
| `secondaryCta` | `{ label: "Find My Gemstone", href: "#" }` | Recommendation-tool route |
| `tertiaryCta` | `{ label: "Consult an Astrologer", href: "#" }` | Consultation page route |
| `imageSrc` | `""` (renders placeholder) | Final Shopify/CMS/local image URL |
| `imageAlt` | "Featured Vedic gemstone" | Alt text |

Example once wired to Shopify:

```jsx
<GemstoneHero
  primaryCta={{ label: "Explore Gemstones", href: "/collections/gemstones" }}
  secondaryCta={{ label: "Find My Gemstone", href: "/pages/find-my-gemstone" }}
  tertiaryCta={{ label: "Consult an Astrologer", href: "/pages/consultation" }}
  imageSrc="https://cdn.shopify.com/.../hero-gemstone.jpg"
  imageAlt="Natural yellow sapphire in gold setting"
/>
```

## Merging into the existing Veda Structure project

1. Copy `src/components/GemstoneHero.jsx` into your existing project's
   components folder.
2. Render `<GemstoneHero />` directly below your existing header component —
   do not wrap it in another header/nav.
3. Pass real `href`s and `imageSrc` once your Shopify collection, recommendation
   page, and consultation page routes exist.
4. No global CSS changes are required — the component's fonts and keyframe
   animations are declared in a local `<style>` tag scoped to itself.
