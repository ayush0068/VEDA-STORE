import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GemstoneProducts, { defaultProducts, GemMedallion } from "../components/GemstoneProducts";

/**
 * GemstoneDetailPage
 * ------------------------------------------------------------------
 * ONE shared, dynamic page — not a separate page per gemstone. The
 * route is /gemstone/:id (see src/App.jsx). Whichever gemstone card
 * was clicked on the home grid, its `id` shows up here as the :id
 * param, this component looks that single product up, and renders
 * only that gemstone's content — same component, different data.
 *
 * Header layout (image, breadcrumb, title, description, checkmark
 * benefits, section tabs, filter bar, collection heading) mirrors the
 * reference screenshot. Everything below that reuses <GemstoneProducts>
 * completely unchanged (full price, Quick View, Add to Cart — exactly
 * like it already looks), just scoped to this one product via the
 * `products` prop. Same theme/fonts/colors as the rest of the site —
 * nothing new introduced.
 *
 * The tab strip and filter row are visual/structural, matching the
 * screenshot's layout. "About", "Benefits" and "Collection" scroll to
 * the matching section on this page; the rest (How To Wear, Who
 * Should Wear, Types, Quality & Price, Jewellery, Cleaning & Care,
 * Buyer Beware, FAQs) are placeholders until that content exists —
 * wire them up to real sections/pages whenever that copy is ready.
 * Likewise the filter pills (Price, Weight, Origin, etc.) are styled
 * to match but aren't wired to real filtering yet, since that needs a
 * full product catalog per gemstone rather than a single sample item.
 * ------------------------------------------------------------------
 */

const SECTION_TABS = [
  { id: "gd-about", label: "About" },
  { id: null, label: "How To Wear" },
  { id: null, label: "Who Should Wear" },
  { id: "gd-benefits", label: "Benefits" },
  { id: null, label: "Types" },
  { id: null, label: "Quality & Price" },
  { id: null, label: "Jewellery" },
  { id: null, label: "Cleaning & Care" },
  { id: null, label: "Buyer Beware" },
  { id: null, label: "FAQs" },
  { id: "gd-collection", label: "Collection" },
];

const FILTERS = ["Price", "Price Per Carat", "Weight (Carat)", "Weight (Ratti)", "Origin", "More Filters"];

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GemstoneDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = defaultProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <section className="bg-[#FAF6F0] px-6 py-24 text-center sm:px-8">
        <p className="text-[15px] font-semibold text-[#3A2417]">
          We couldn't find that gemstone.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#3A2417] px-5 py-3 text-[14px] font-bold text-[#FAF6F0] transition-transform hover:-translate-y-0.5"
        >
          ← Back to all gemstones
        </button>
      </section>
    );
  }

  const benefits = product.benefit
    ? product.benefit.split(",").map((b) => b.trim()).filter(Boolean)
    : [];

  const scrollToTab = (tab) => {
    if (!tab.id) return;
    document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <section className="gemstone-detail bg-[#FAF6F0] px-6 pb-4 pt-8 sm:px-8" aria-label={`${product.name} details`}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@500;600;700;800&display=swap');
          .gemstone-detail { font-family:'Manrope', sans-serif; }
          .gemstone-detail .gd-heading { font-family:'Cormorant Garamond', serif; }
        `}</style>

        <div className="mx-auto max-w-7xl">
          {/* ---------------- hero: image + title/description/benefits ---------------- */}
          <div id="gd-about" className="grid grid-cols-1 gap-8 scroll-mt-6 lg:grid-cols-[340px_1fr] lg:items-center lg:gap-10">
            {/* big framed hero image, on the same gold plinth used elsewhere */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[radial-gradient(ellipse_75%_65%_at_50%_30%,#F5B041_0%,#E9A331_55%,#8a5a1f_100%)] shadow-[0_18px_40px_-24px_rgba(58,36,23,0.35)] lg:aspect-square">
              <GemMedallion product={product} className="h-full w-full" />
            </div>

            <div>
              <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#3A2417]/60" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-[#3A2417]">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span>Gemstones</span>
                <span aria-hidden="true">/</span>
                <span className="text-[#3A2417]">
                  {product.name}
                  {product.sanskrit ? ` (${product.sanskrit} Stone)` : ""}
                </span>
              </nav>

              <h1 className="gd-heading text-[2rem] font-semibold text-[#3A2417] sm:text-[2.75rem]">
                {product.name}
                {product.sanskrit && <span className="text-[#8a5a1f]"> — {product.sanskrit}</span>}
              </h1>

              {product.description && (
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6B4A32]">{product.description}</p>
              )}

              {benefits.length > 0 && (
                <ul id="gd-benefits" className="mt-5 scroll-mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#3A2417]">
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#E9A331" strokeWidth="1.8" />
                        <path d="M8 12.5l2.5 2.5L16 9.5" fill="none" stroke="#E9A331" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ---------------- section tab strip ---------------- */}
          <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 overflow-x-auto border-t border-b border-[#3A2417]/10 py-3.5 text-[13.5px] font-bold text-[#3A2417]" aria-label="Gemstone sections">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => scrollToTab(tab)}
                className={`whitespace-nowrap transition-colors hover:text-[#8a5a1f] ${tab.id ? "" : "text-[#3A2417]/50"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ---------------- decorative filter bar ---------------- */}
          <div className="mt-5 flex flex-wrap gap-3">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-[#3A2417]/15 bg-white px-4 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-[#3A2417]/70 transition-colors hover:border-[#E9A331]"
              >
                {f}
                <ChevronDown />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- collection heading ---------------- */}
      <div id="gd-collection" className="scroll-mt-6 bg-[#FAF6F0] px-6 pt-10 text-center sm:px-8">
        <h2 className="gemstone-detail gd-heading text-[1.75rem] font-semibold text-[#3A2417] sm:text-[2.1rem]">
          {product.name}
          {product.sanskrit ? ` (${product.sanskrit} Stone)` : ""} Online Collection
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[14px] text-[#6B4A32]">
          Select a beautiful piece from our wide online selection, or chat with our experts for more options!
        </p>
        <div className="mx-auto mt-6 max-w-7xl border-t border-[#3A2417]/10" />
      </div>

      {/* Same card design as the rest of the site — price, Quick View,
          Add to Cart, everything intact. Scoped to just this one gemstone. */}
      <GemstoneProducts
        title={product.name}
        subtitle={product.sanskrit || "Products of Trusted Excellence"}
        products={[product]}
      />
    </div>
  );
}