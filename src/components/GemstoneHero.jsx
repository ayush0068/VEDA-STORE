import React, { useState } from "react";
import { useGemstoneFinderOptions } from "../hooks/useGemstoneFinderOptions";

/**
 * GemstoneHero
 * ------------------------------------------------------------------
 * Full-bleed banner hero: a large premium gemstone/jewellery image
 * fills the section edge-to-edge, with a floating cream "Find Your
 * Right Gemstone" finder card anchored on top of it — same functional
 * layout as a typical gemstone-finder banner, restyled entirely in
 * the Veda Structure gold/cream palette (no borrowed branding,
 * colors, or gradients).
 *
 * Sits directly beneath the existing site header — does NOT include
 * header, nav, or footer.
 *
 * Drop-in usage (Vite + React + Tailwind):
 *   import GemstoneHero from "./components/GemstoneHero";
 *   <GemstoneHero />
 *
 * ------------------------------------------------------------------
 * CHANGING DROPDOWN OPTIONS
 * ------------------------------------------------------------------
 * All five dropdowns ship with sample options (drawn from the PDF's
 * gemstone/carat/price/treatment/origin lists) so the form looks
 * complete out of the box. Override any list via props whenever your
 * real catalog data is ready — passing a prop fully replaces that
 * dropdown's list, e.g.:
 *
 *   <GemstoneHero
 *     gemstoneOptions={[
 *       { value: "ruby", label: "Ruby — Manik" },
 *       { value: "emerald", label: "Emerald — Panna" },
 *       { value: "yellow-sapphire", label: "Yellow Sapphire — Pukhraj" },
 *     ]}
 *     caratOptions={[
 *       { value: "0-2", label: "0 – 2 Carat" },
 *       { value: "2-5", label: "2 – 5 Carat" },
 *       { value: "5+", label: "5+ Carat" },
 *     ]}
 *     priceOptions={[
 *       { value: "0-5000", label: "Under ₹5,000" },
 *       { value: "5000-25000", label: "₹5,000 – ₹25,000" },
 *       { value: "25000+", label: "₹25,000+" },
 *     ]}
 *     treatmentOptions={[
 *       { value: "natural", label: "Natural / Untreated" },
 *       { value: "heated", label: "Heated" },
 *     ]}
 *     originOptions={[
 *       { value: "ceylon", label: "Sri Lanka / Ceylon" },
 *       { value: "burma", label: "Burma / Myanmar" },
 *     ]}
 *     onSearch={(values) => {
 *       // values = { mode, gemstone, carat, price } normally, or
 *       // { mode, gemstone, carat, price, treatment, origin } once
 *       // the person has expanded "Advanced Search"
 *       // e.g. redirect to a Shopify collection/search URL later
 *     }}
 *   />
 * ------------------------------------------------------------------
 * Clicking "Advanced Search" expands the form in place to reveal
 * Select Treatment / Select Origin, and swaps the link to
 * "Basic Search ←" to collapse back — no page navigation involved.
 * ------------------------------------------------------------------
 * CONNECTING TO SHOPIFY (live dropdown data)
 * ------------------------------------------------------------------
 * Off by default — zero network calls, so nothing can error until
 * you turn it on. To connect:
 *
 *   1. Add a .env file (see .env.example) with:
 *        VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *        VITE_SHOPIFY_STOREFRONT_TOKEN=your-public-storefront-token
 *
 *   2. Pass the `shopify` prop:
 *        <GemstoneHero
 *          shopify={{
 *            enabled: true,
 *            collectionHandle: "gemstones",
 *            filterMap: {
 *              gemstone: "filter.p.tag",
 *              carat: "filter.v.m.custom.carat",
 *              price: "filter.v.price",
 *              treatment: "filter.p.m.custom.treatment",
 *              origin: "filter.p.m.custom.origin",
 *            },
 *          }}
 *        />
 *
 * If the store/token is missing, the collection handle doesn't
 * exist, the request fails, or a given filter isn't found, that one
 * dropdown (or all of them) silently keeps its sample/prop options
 * instead — it logs a console.warn for you to debug, but a site
 * visitor never sees an error state.
 * ------------------------------------------------------------------
 */

const defaultModes = [
  { id: "gemstone", label: "By Gemstone" },
  { id: "purpose", label: "By Purpose" },
];

// Sample defaults so the form isn't empty out of the box — replace
// with your real catalog data via props whenever you're ready.
const defaultGemstoneOptions = [
  { value: "ruby", label: "Ruby — Manik" },
  { value: "pearl", label: "Pearl — Moti" },
  { value: "red-coral", label: "Red Coral — Moonga" },
  { value: "emerald", label: "Emerald — Panna" },
  { value: "yellow-sapphire", label: "Yellow Sapphire — Pukhraj" },
  { value: "diamond", label: "Diamond — Heera" },
  { value: "blue-sapphire", label: "Blue Sapphire — Neelam" },
  { value: "hessonite", label: "Hessonite — Gomed" },
  { value: "cats-eye", label: "Cat's Eye — Lehsunia" },
];

const defaultCaratOptions = [
  { value: "0-2", label: "0 – 2 Carat" },
  { value: "2-5", label: "2 – 5 Carat" },
  { value: "5-10", label: "5 – 10 Carat" },
  { value: "10+", label: "10+ Carat" },
];

const defaultPriceOptions = [
  { value: "0-5000", label: "Under ₹5,000" },
  { value: "5000-10000", label: "₹5,000 – ₹10,000" },
  { value: "10000-25000", label: "₹10,000 – ₹25,000" },
  { value: "25000-50000", label: "₹25,000 – ₹50,000" },
  { value: "50000+", label: "₹50,000+" },
];

const defaultTreatmentOptions = [
  { value: "natural", label: "Natural / Untreated" },
  { value: "heated", label: "Heated" },
  { value: "unheated", label: "Unheated" },
];

const defaultOriginOptions = [
  { value: "ceylon", label: "Sri Lanka / Ceylon" },
  { value: "burma", label: "Burma / Myanmar" },
  { value: "mozambique", label: "Mozambique" },
  { value: "colombia", label: "Colombia" },
  { value: "thailand", label: "Thailand" },
  { value: "africa", label: "Africa" },
  { value: "india", label: "India" },
];

export default function GemstoneHero({
  formTitle = "Find Your Right Gemstone",
  modes = defaultModes,
  gemstoneOptions = defaultGemstoneOptions,
  caratOptions = defaultCaratOptions,
  priceOptions = defaultPriceOptions,
  treatmentOptions = defaultTreatmentOptions,
  originOptions = defaultOriginOptions,
  searchLabel = "Search",
  advancedSearchLabel = "Advanced Search",
  basicSearchLabel = "Basic Search",
  onSearch,
  // Pass a real image URL here later (Shopify CDN / local asset / CMS
  // section image). Until then a premium placeholder fills this exact
  // spot — no restructuring required when you swap it in.
  imageSrc = "/image/GemBanner.png",
  imageAlt = "Featured Vedic gemstones and fine jewellery",
  // Optional live Shopify wiring — OFF by default, so out of the box
  // this component makes zero network calls and cannot error.
  // Flip `enabled: true` once VITE_SHOPIFY_STORE_DOMAIN and
  // VITE_SHOPIFY_STOREFRONT_TOKEN are set in your .env — see README.
  shopify = {
    enabled: false,
    collectionHandle: "gemstones",
    // Map each dropdown to the Shopify collection filter id/label
    // that should populate it (Storefront API "Filter" objects,
    // e.g. from tags or metafield-based filters you've enabled in
    // Shopify search & discovery settings). Adjust to match your
    // store's actual filter ids/labels.
    filterMap: {
      gemstone: "filter.p.tag",
      carat: "filter.v.m.custom.carat",
      price: "filter.v.price",
      treatment: "filter.p.m.custom.treatment",
      origin: "filter.p.m.custom.origin",
    },
  },
}) {
  const [mode, setMode] = useState(modes[0]?.id ?? "gemstone");
  const [gemstone, setGemstone] = useState("");
  const [carat, setCarat] = useState("");
  const [price, setPrice] = useState("");
  const [treatment, setTreatment] = useState("");
  const [origin, setOrigin] = useState("");
  const [advanced, setAdvanced] = useState(false);

  // Falls back to the static props/defaults above whenever Shopify
  // isn't enabled/configured, or whenever any individual filter
  // fails to resolve — never throws, never blanks the UI.
  const { options: liveOptions, loading: optionsLoading } = useGemstoneFinderOptions({
    enabled: shopify?.enabled,
    collectionHandle: shopify?.collectionHandle,
    filterMap: shopify?.filterMap,
    fallback: {
      gemstone: gemstoneOptions,
      carat: caratOptions,
      price: priceOptions,
      treatment: treatmentOptions,
      origin: originOptions,
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = advanced
      ? { mode, gemstone, carat, price, treatment, origin }
      : { mode, gemstone, carat, price };

    if (onSearch) {
      onSearch(values);
      return;
    }

    // No onSearch provided — fall back to a same-tab redirect to the
    // Shopify collection, passing the picks as query params. Adjust
    // the param names to match your theme's actual filter syntax
    // once you wire this up for real; wrapped in try/catch so a
    // misconfigured handle never breaks the page.
    try {
      if (typeof window !== "undefined" && shopify?.collectionHandle) {
        const params = new URLSearchParams(
          Object.fromEntries(Object.entries(values).filter(([, v]) => v))
        );
        window.location.href = `/collections/${shopify.collectionHandle}${
          params.toString() ? `?${params.toString()}` : ""
        }`;
      }
    } catch (err) {
      console.warn("[GemstoneHero] Could not build search redirect:", err);
    }
  };

  const selectChevron = (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="#3A2417" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const FinderForm = (
    <form
      onSubmit={handleSubmit}
      className="gemstone-hero__finder gh-animate-card w-full rounded-2xl border border-[#E9A331]/30 bg-[#FAF6F0] p-8 shadow-[0_30px_70px_-25px_rgba(58,36,23,0.55)] sm:p-9"
    >
      <h2 className="gemstone-hero__title text-[1.6rem] font-bold leading-tight text-[#3A2417]">
        {formTitle}
      </h2>

      {/* mode toggle */}
      <div className="mt-5 flex items-center gap-6" role="radiogroup" aria-label="Search by">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <label key={m.id} className="inline-flex cursor-pointer items-center gap-2 select-none">
              <input
                type="radio"
                name="gh-finder-mode"
                value={m.id}
                checked={active}
                onChange={() => setMode(m.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`relative inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors ${
                  active ? "border-[#E9A331]" : "border-[#3A2417]/25"
                }`}
              >
                {active && <span className="h-[9px] w-[9px] rounded-full bg-[#E9A331]" />}
              </span>
              <span
                className={`text-[14.5px] font-semibold transition-colors ${
                  active ? "text-[#3A2417]" : "text-[#3A2417]/50"
                }`}
              >
                {m.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* selects */}
      <div className="mt-5 flex flex-col gap-3.5">
        <div className="relative">
          <select
            value={gemstone}
            onChange={(e) => setGemstone(e.target.value)}
            disabled={optionsLoading}
            className="w-full appearance-none rounded-lg border border-[#3A2417]/15 bg-white px-4 py-3.5 text-[15px] text-[#3A2417] focus:border-[#E9A331] focus:outline-none focus:ring-2 focus:ring-[#E9A331]/25 disabled:opacity-60"
          >
            <option value="">{optionsLoading ? "Loading options…" : "Select Gemstone"}</option>
            {liveOptions.gemstone.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectChevron}
        </div>

        <div className="relative">
          <select
            value={carat}
            onChange={(e) => setCarat(e.target.value)}
            disabled={optionsLoading}
            className="w-full appearance-none rounded-lg border border-[#3A2417]/15 bg-white px-4 py-3.5 text-[15px] text-[#3A2417] focus:border-[#E9A331] focus:outline-none focus:ring-2 focus:ring-[#E9A331]/25 disabled:opacity-60"
          >
            <option value="">{optionsLoading ? "Loading options…" : "Select Carat Weight"}</option>
            {liveOptions.carat.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectChevron}
        </div>

        <div className="relative">
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={optionsLoading}
            className="w-full appearance-none rounded-lg border border-[#3A2417]/15 bg-white px-4 py-3.5 text-[15px] text-[#3A2417] focus:border-[#E9A331] focus:outline-none focus:ring-2 focus:ring-[#E9A331]/25 disabled:opacity-60"
          >
            <option value="">{optionsLoading ? "Loading options…" : "Select Price"}</option>
            {liveOptions.price.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectChevron}
        </div>

        {advanced && (
          <>
            <div className="relative">
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                disabled={optionsLoading}
                className="w-full appearance-none rounded-lg border border-[#3A2417]/15 bg-white px-4 py-3.5 text-[15px] text-[#3A2417] focus:border-[#E9A331] focus:outline-none focus:ring-2 focus:ring-[#E9A331]/25 disabled:opacity-60"
              >
                <option value="">{optionsLoading ? "Loading options…" : "Select Treatment"}</option>
                {liveOptions.treatment.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {selectChevron}
            </div>

            <div className="relative">
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={optionsLoading}
                className="w-full appearance-none rounded-lg border border-[#3A2417]/15 bg-white px-4 py-3.5 text-[15px] text-[#3A2417] focus:border-[#E9A331] focus:outline-none focus:ring-2 focus:ring-[#E9A331]/25 disabled:opacity-60"
              >
                <option value="">{optionsLoading ? "Loading options…" : "Select Origin"}</option>
                {liveOptions.origin.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {selectChevron}
            </div>
          </>
        )}
      </div>

      {/* search button — same gold theme, no borrowed gradient colors */}
      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#E9A331] via-[#F5B041] to-[#F4B843] px-6 py-4 text-[15px] font-bold tracking-wide text-[#3A2417] shadow-[0_10px_26px_-10px_rgba(233,163,49,0.65)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2417]"
      >
        {searchLabel}
      </button>

      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#8a5a1f] underline decoration-[#E9A331]/50 underline-offset-4 transition-colors hover:text-[#3A2417]"
          aria-expanded={advanced}
        >
          {advanced ? (
            <>
              <span aria-hidden="true">←</span>
              {basicSearchLabel}
            </>
          ) : (
            <>
              {advancedSearchLabel}
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <section className="gemstone-hero relative isolate bg-[#3A2417]" aria-label="Gemstone finder">
      {/* Local styles: fonts, motion, scoped only to this section */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@500;600;700;800&display=swap');

        .gemstone-hero { --gh-gold-1:#E9A331; --gh-gold-2:#F5B041; --gh-gold-3:#F4B843; --gh-cream-1:#FAF6F0; --gh-cream-2:#FFF5DE; --gh-ink:#3A2417; --gh-ink-soft:#6B4A32; }
        .gemstone-hero__finder, .gemstone-hero__title { font-family:'Manrope', sans-serif; }

        @keyframes gh-rise { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes gh-fade { from { opacity:0; } to { opacity:1; } }
        .gh-animate-card { animation: gh-rise 0.7s cubic-bezier(.2,.7,.2,1) both; }
        .gh-animate-bg { animation: gh-fade 1s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .gh-animate-card, .gh-animate-bg { animation: none; }
        }
      `}</style>

      {/* ---------------- Full-bleed background image / placeholder ---------------- */}
      <div className="gh-animate-bg absolute inset-0" role="img" aria-label={imageAlt}>
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
        ) : (
          <div className="relative h-full w-full bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,#F4B843_0%,#F5B041_28%,#E9A331_52%,#7a5326_78%,#3A2417_100%)]">
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.12]"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <pattern id="gh-facets" width="14" height="14" patternUnits="userSpaceOnUse">
                  <path d="M0 7 L7 0 L14 7 L7 14 Z" fill="none" stroke="#FAF6F0" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#gh-facets)" />
            </svg>
            
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A2417]/35 via-[#3A2417]/5 to-transparent" />
      </div>

      <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-[#E9A331] via-[#F5B041] to-[#F4B843]" />

      {/* ---------------- Desktop / tablet: finder card over the banner ---------------- */}
      <div className="relative z-10 mx-auto hidden max-w-7xl items-center px-8 py-16 lg:flex lg:min-h-[600px] lg:py-20">
        <div className="w-[420px] shrink-0">{FinderForm}</div>
      </div>

      {/* ---------------- Mobile / small tablet: stacked layout ---------------- */}
      <div className="relative z-10 lg:hidden">
        <div className="aspect-[4/3] w-full sm:aspect-[16/9]" aria-hidden="true" />
        <div className="-mt-10 px-0 sm:mx-6 sm:px-0">{FinderForm}</div>
      </div>
    </section>
  );
}