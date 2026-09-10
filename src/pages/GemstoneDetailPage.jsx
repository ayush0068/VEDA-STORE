import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GemstoneProducts, { defaultProducts } from "../components/GemstoneProducts";

/**
 * GemstoneDetailPage
 * ------------------------------------------------------------------
 * ONE shared, dynamic page — not a separate page per gemstone. The
 * route is /gemstone/:id (see src/App.jsx). Whichever gemstone card
 * was clicked on the home grid, its `id` shows up here as the :id
 * param, this component looks that single product up, and renders
 * only that gemstone's content — same component, different data.
 *
 * The product grid below reuses <GemstoneProducts> completely
 * unchanged (full price, Quick View, Add to Cart — exactly like it
 * already looks), just scoped to this one product via the `products`
 * prop. Same theme/fonts/colors as the rest of the site — nothing new
 * introduced here.
 * ------------------------------------------------------------------
 */
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

  return (
    <div>
      <section className="gemstone-detail-header bg-[#FAF6F0] px-6 pb-4 pt-8 sm:px-8" aria-label={`${product.name} details`}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@500;600;700;800&display=swap');
          .gemstone-detail-header { font-family:'Manrope', sans-serif; }
          .gemstone-detail-header .gd-heading { font-family:'Cormorant Garamond', serif; }
        `}</style>

        <div className="mx-auto max-w-7xl">
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
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#6B4A32]">{product.description}</p>
          )}

          {benefits.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
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
      </section>

      {/* Same card design as the rest of the site — price, Quick View,
          everything intact. Scoped to just this one gemstone. */}
      <GemstoneProducts
        title={product.name}
        subtitle={product.sanskrit || "Products of Trusted Excellence"}
        products={[product]}
      />
    </div>
  );
}