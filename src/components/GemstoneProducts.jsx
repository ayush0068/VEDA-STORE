import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGemstoneProducts } from "../hooks/useGemstoneProducts";

/**
 * GemstoneProducts
 * ------------------------------------------------------------------
 * "Buy Gemstones Online" grid section — sits directly below
 * <GemstoneHero /> in the same Veda Structure gold / cream palette
 * and fonts (Cormorant Garamond heading, Manrope everything else).
 *
 * Card anatomy (mirrors a typical product card, restyled in Veda's
 * own colors — no borrowed branding):
 *   - corner discount badge + wishlist heart
 *   - circular framed product image on a warm gold plinth
 *   - "Quick View" bar that slides up on hover and opens the modal
 *     below, without leaving the page
 *   - rating + review count, name, price row (current + struck-
 *     through original) with a compact "Add" button
 *
 * Clicking "Quick View" (or the image) opens <QuickViewModal>: a
 * bigger image + thumbnail strip, certification line, price,
 * description, a size/fitting picker, a quantity stepper, and
 * "Add to Cart" — all still demo data until Shopify is wired in.
 *
 * ------------------------------------------------------------------
 * ADDING / SWAPPING A PRODUCT IMAGE
 * ------------------------------------------------------------------
 * Every product's images live right next to that product in the
 * `defaultProducts` array below — nothing is imported or declared
 * separately up top:
 *
 *   { id: "ruby", name: "Ruby",
 *     image: "/image/products/ruby.png",
 *     gallery: ["/image/products/ruby.png", "/image/products/ruby-2.png"],
 *     ... }
 *
 * Drop the files in `public/image/products/` with matching names.
 * Until a real photo exists (or if it 404s), the card falls back to
 * a soft gem-colored placeholder disc — never a broken-image icon.
 *
 * ------------------------------------------------------------------
 * CONNECTING TO SHOPIFY (live product data)
 * ------------------------------------------------------------------
 * Off by default — zero network calls, so nothing can error until
 * you turn it on. Same wiring pattern as GemstoneHero's finder:
 *
 *   1. Add a .env file (see .env.example) with:
 *        VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *        VITE_SHOPIFY_STOREFRONT_TOKEN=your-public-storefront-token
 *
 *   2. Pass the `shopify` prop:
 *        <GemstoneProducts
 *          shopify={{ enabled: true, collectionHandle: "gemstones" }}
 *        />
 *
 * Price, compare-at price, images, and variant size/fitting options
 * come straight from the Shopify product. Rating, review count, and
 * the certification line aren't native Shopify fields, so they're
 * read from metafields (reviews.rating, reviews.rating_count,
 * custom.certification) if you've set those up — any product
 * missing them just falls back to the sample defaults instead of
 * hiding that part of the card.
 *
 * If the store/token is missing, the collection handle doesn't
 * exist, or the request fails, the whole grid silently keeps the
 * demo products below — it logs a console.warn for you to debug,
 * but a site visitor never sees an error state.
 * ------------------------------------------------------------------
 */

// Sample catalog so the section isn't empty out of the box — replace
// any entry, or pass your own `products` prop, whenever you're ready.
export const defaultProducts = [
  {
    id: "yellow-sapphire",
    name: "Yellow Sapphire",
    sanskrit: "Pukhraj",
    benefit: "Divine Luck, Prosperity, Blissful Matrimony",
    description:
      "A Vedic gemstone for Jupiter, worn for wisdom, prosperity and a blissful married life. Natural and lab-certified.",
    image: "/image/Yellow_Sapphire.png",
    gallery: ["/image/Yellow_Sapphire.png"],
    fallbackFrom: "#FDE68A",
    fallbackTo: "#B8860B",
    rating: 5,
    reviews: 412,
    price: "₹3,599",
    originalPrice: "₹3,999",
    badge: "10% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["3 – 5 Carat", "5 – 7 Carat"],
  },
  {
    id: "blue-sapphire",
    name: "Blue Sapphire",
    sanskrit: "Neelam",
    benefit: "Great Fame, Discipline, Reverses Misfortunes",
    description:
      "Saturn's gemstone, known for its fast, powerful results — discipline, career growth and protection from misfortune.",
    image: "/image/Blue_Sapphire.png",
    gallery: ["/image/Blue_Sapphire.png"],
    fallbackFrom: "#93C5FD",
    fallbackTo: "#1E3A8A",
    rating: 5,
    reviews: 286,
    price: "₹5,299",
    originalPrice: "₹6,299",
    badge: "16% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["2 – 4 Carat", "4 – 6 Carat"],
  },
  {
    id: "emerald",
    name: "Emerald",
    sanskrit: "Panna",
    benefit: "Vocal Charm, Creativity, Success in Business",
    description:
      "Mercury's gemstone for clear communication, creativity and success in business and studies.",
    image: "/image/Emerald.png",
    gallery: ["/image/Emerald.png"],
    fallbackFrom: "#6EE7B7",
    fallbackTo: "#065F46",
    rating: 4,
    reviews: 198,
    price: "₹2,899",
    originalPrice: null,
    badge: null,
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["3 – 5 Carat", "5 – 7 Carat"],
  },
  {
    id: "ruby",
    name: "Ruby",
    sanskrit: "Manik",
    benefit: "Great Health, Will Power, Fame & Reputation",
    description:
      "The Sun's gemstone — worn for vitality, leadership, willpower and lasting fame and reputation.",
    image: "/image/Ruby.png",
    gallery: ["/image/Ruby.png"],
    fallbackFrom: "#FCA5A5",
    fallbackTo: "#7F1D1D",
    rating: 5,
    reviews: 351,
    price: "₹4,199",
    originalPrice: "₹4,999",
    badge: "16% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["2 – 4 Carat", "4 – 6 Carat"],
  },
  {
    id: "opal",
    name: "Opal",
    sanskrit: "Upal",
    benefit: "Luxury, Physical Beauty, Romantic Bliss",
    description: "Venus's gemstone for charm, luxury, creativity and romantic harmony.",
    image: "/image/products/opal.png",
    gallery: ["/image/products/opal.png"],
    fallbackFrom: "#A7F3D0",
    fallbackTo: "#5B21B6",
    rating: 4,
    reviews: 87,
    price: "₹1,999",
    originalPrice: "₹2,499",
    badge: "20% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["3 – 5 Carat"],
  },
  {
    id: "pearl",
    name: "Pearl",
    sanskrit: "Moti",
    benefit: "Mental Strength, Fortune, Peace & Fulfillment",
    description: "The Moon's gemstone, worn to calm the mind and bring emotional balance and peace.",
    image: "/image/products/pearl.png",
    gallery: ["/image/products/pearl.png"],
    fallbackFrom: "#FFFFFF",
    fallbackTo: "#CBB78B",
    rating: 5,
    reviews: 264,
    price: "₹1,499",
    originalPrice: null,
    badge: null,
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["4 – 6 Carat", "6 – 8 Carat"],
  },
  {
    id: "red-coral",
    name: "Red Coral",
    sanskrit: "Moonga",
    benefit: "Averts Mishaps, Courage, Overall Strength",
    description: "Mars's gemstone for courage, vitality and protection from accidents and mishaps.",
    image: "/image/products/red-coral.png",
    gallery: ["/image/products/red-coral.png"],
    fallbackFrom: "#FCA5A5",
    fallbackTo: "#B91C1C",
    rating: 4,
    reviews: 132,
    price: "₹2,299",
    originalPrice: "₹2,799",
    badge: "18% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["5 – 7 Carat"],
  },
  {
    id: "hessonite",
    name: "Hessonite",
    sanskrit: "Gomed",
    benefit: "Pacifies Rahu, Popularity, Speculative Success",
    description: "Rahu's gemstone — worn to pacify Rahu's effects and boost popularity and speculative gains.",
    image: "/image/products/hessonite.png",
    gallery: ["/image/products/hessonite.png"],
    fallbackFrom: "#D97706",
    fallbackTo: "#3A2417",
    rating: 5,
    reviews: 156,
    price: "₹1,799",
    originalPrice: "₹2,199",
    badge: "18% OFF",
    certification: "100% Lab Certified Authentic",
    sizeLabel: "Select Carat Weight",
    sizeOptions: ["4 – 6 Carat", "6 – 8 Carat"],
  },
];

function Stars({ rating = 5, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={i < rating ? "fill-[#E9A331]" : "fill-[#3A2417]/15"}
        >
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.6l-5.9 3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export function GemMedallion({ product, className = "" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showFallback = !product.image || imgFailed;

  return showFallback ? (
    <div className={`flex items-center justify-center ${className}`}>
      <span
        aria-hidden="true"
        className="block h-[70%] w-[70%] rounded-[50%] shadow-[inset_-6px_-10px_18px_rgba(0,0,0,0.25),inset_6px_8px_16px_rgba(255,255,255,0.45)]"
        style={{
          background: `radial-gradient(ellipse at 35% 30%, ${product.fallbackFrom}, ${product.fallbackTo})`,
        }}
      />
    </div>
  ) : (
    <img
      src={product.image}
      alt={product.name}
      onError={() => setImgFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

function ProductCard({ product, onQuickView, onAdd, showPrice = true, showQuickView = true, showAddToCart = true, onCardClick }) {
  const [wished, setWished] = useState(false);
  const showFooterRow = showPrice || showAddToCart;

  // On the home grid, onCardClick is set (navigate to this gemstone's own
  // dynamic page) and takes over from the Quick View modal. Everywhere else
  // (the gemstone's own page) this stays undefined and the card behaves
  // exactly as before — clicking the image/pill opens the Quick View modal.
  const handleMediaClick = (e) => {
    e.stopPropagation();
    if (onCardClick) onCardClick(product);
    else onQuickView(product);
  };

  return (
    <div
      onClick={onCardClick ? () => onCardClick(product) : undefined}
      role={onCardClick ? "link" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onKeyDown={
        onCardClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick(product);
              }
            }
          : undefined
      }
      aria-label={onCardClick ? `View ${product.name}` : undefined}
      className={`gp-animate-card group relative flex flex-col overflow-hidden rounded-2xl border border-[#3A2417]/10 bg-white shadow-[0_18px_40px_-24px_rgba(58,36,23,0.35)] transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-22px_rgba(58,36,23,0.45)] ${
        onCardClick ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2417]" : ""
      }`}
    >
      {/* image / plinth area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(ellipse_75%_65%_at_50%_30%,#F5B041_0%,#E9A331_55%,#8a5a1f_100%)]">
        {showPrice && product.badge && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[#3A2417] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#FAF6F0] shadow-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setWished((v) => !v);
          }}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2417]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-7.2-4.5-9.6-9C.7 8.6 2 5 5.4 4.2 7.6 3.7 9.8 4.6 12 7c2.2-2.4 4.4-3.3 6.6-2.8C22 5 23.3 8.6 21.6 12c-2.4 4.5-9.6 9-9.6 9z"
              fill={wished ? "#E9A331" : "none"}
              stroke="#3A2417"
              strokeOpacity="0.55"
              strokeWidth="1.6"
            />
          </svg>
        </button>

        {/* full-bleed product image — fills the whole area, replacing the gold plinth once a real photo is set */}
        <button
          type="button"
          onClick={handleMediaClick}
          aria-label={onCardClick ? `View ${product.name}` : `Quick view ${product.name}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <GemMedallion product={product} className="h-full w-full transition-transform duration-300 group-hover:scale-[1.04]" />
        </button>

        {/* Quick View — floating pill, clear of the edges, slides up on hover/focus. Hidden on the home grid. */}
        {showQuickView && (
          <button
            type="button"
            onClick={handleMediaClick}
            className="absolute bottom-3 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-3 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#3A2417]/10 bg-white px-4 py-2 text-[12.5px] font-bold text-[#3A2417] opacity-0 shadow-[0_10px_22px_-8px_rgba(58,36,23,0.4)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
                fill="none"
                stroke="#3A2417"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="3" fill="none" stroke="#3A2417" strokeWidth="1.7" />
            </svg>
            Quick View
          </button>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-[12.5px] font-medium text-[#3A2417]/50">({product.reviews})</span>
        </div>

        <h3 className="text-[15.5px] font-bold leading-snug text-[#3A2417]">{product.name}</h3>

        {product.benefit && (
          <p className="text-[12px] leading-snug text-[#6B4A32]">{product.benefit}</p>
        )}

        <div className="my-1.5 h-px w-full bg-[#3A2417]/10" />

        {showFooterRow && (
          <div className={`flex items-center gap-3 ${showPrice ? "justify-between" : "justify-end"}`}>
            {showPrice && (
              <div className="flex items-baseline gap-2">
                <span className="text-[18px] font-extrabold text-[#3A2417]">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[13px] text-[#3A2417]/40 line-through">{product.originalPrice}</span>
                )}
              </div>
            )}

            {showAddToCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.(product);
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E9A331]/40 bg-[#FAF6F0] px-4 py-2 text-[13px] font-bold text-[#3A2417] transition-colors hover:border-[#E9A331] hover:bg-[#FDF0DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2417]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 7h12l-1 12.5a1.5 1.5 0 01-1.5 1.5h-7a1.5 1.5 0 01-1.5-1.5L6 7z"
                    fill="none"
                    stroke="#3A2417"
                    strokeWidth="1.6"
                  />
                  <path d="M9 7a3 3 0 016 0" fill="none" stroke="#3A2417" strokeWidth="1.6" />
                </svg>
                Add
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickViewModal({ product, onClose, onAddToCart }) {
  const [activeImage, setActiveImage] = useState(product?.image);
  const [selectedSize, setSelectedSize] = useState(product?.sizeOptions?.[0] ?? null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveImage(product?.image);
    setSelectedSize(product?.sizeOptions?.[0] ?? null);
    setQty(1);
  }, [product]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  const gallery = product.gallery?.length ? product.gallery : [product.image];

  return (
    <div
      className="gp-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#3A2417]/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} quick view`}
      onClick={onClose}
    >
      <div
        className="gp-modal-panel relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-30px_rgba(58,36,23,0.6)] md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#3A2417] shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2417]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* left: full-bleed image + floating thumbnail strip */}
        <div className="relative flex min-h-[320px] flex-col overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,#FFF5DE_0%,#F5B041_45%,#E9A331_75%,#8a5a1f_100%)] md:min-h-full">
          <GemMedallion
            product={{ ...product, image: activeImage }}
            className="absolute inset-0 h-full w-full"
          />

          {gallery.length > 1 && (
            <div className="relative z-10 mt-auto flex justify-center gap-2 p-4">
              {gallery.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white/90 p-1 shadow-sm transition-colors ${
                    activeImage === src ? "border-[#3A2417]" : "border-white/70"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* right: details */}
        <div className="flex flex-col gap-3 p-6 sm:p-8">
          {product.certification && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E9A331]/40 bg-[#FAF6F0] px-3 py-1 text-[12px] font-bold text-[#3A2417]">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z"
                  fill="none"
                  stroke="#E9A331"
                  strokeWidth="1.8"
                />
                <path d="M9 12.5l2 2 4-4.5" fill="none" stroke="#3A2417" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {product.certification}
            </span>
          )}

          <h3 className="text-[1.5rem] font-bold leading-tight text-[#3A2417]">{product.name}</h3>

          <div className="flex items-center gap-2">
            <Stars rating={product.rating} size={15} />
            <span className="text-[13.5px] font-semibold text-[#3A2417]/60">
              {product.rating} ({product.reviews} customer reviews)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[1.6rem] font-extrabold text-[#3A2417]">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[15px] text-[#3A2417]/40 line-through">{product.originalPrice}</span>
            )}
            {product.badge && (
              <span className="rounded-full bg-[#FAF6F0] px-2.5 py-1 text-[12px] font-bold text-[#8a5a1f]">
                {product.badge}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-[14px] leading-relaxed text-[#6B4A32]">{product.description}</p>
          )}

          {product.sizeOptions?.length > 0 && (
            <div className="mt-1">
              <p className="mb-2 text-[13.5px] font-bold text-[#3A2417]">{product.sizeLabel || "Select Size / Fitting"}:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedSize(opt)}
                    className={`rounded-lg px-4 py-2 text-[13px] font-bold transition-colors ${
                      selectedSize === opt
                        ? "bg-[#3A2417] text-[#FAF6F0]"
                        : "border border-[#3A2417]/15 bg-white text-[#3A2417] hover:border-[#E9A331]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-[#3A2417]/15">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-3.5 py-2.5 text-[16px] font-bold text-[#3A2417] hover:bg-[#FAF6F0]"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-[15px] font-bold text-[#3A2417]">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="px-3.5 py-2.5 text-[16px] font-bold text-[#3A2417] hover:bg-[#FAF6F0]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onAddToCart?.({ product, qty, size: selectedSize })}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3A2417] px-5 py-3 text-[14.5px] font-bold text-[#FAF6F0] shadow-[0_10px_22px_-10px_rgba(58,36,23,0.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9A331]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 7h12l-1 12.5a1.5 1.5 0 01-1.5 1.5h-7a1.5 1.5 0 01-1.5-1.5L6 7z"
                  fill="none"
                  stroke="#FAF6F0"
                  strokeWidth="1.6"
                />
                <path d="M9 7a3 3 0 016 0" fill="none" stroke="#FAF6F0" strokeWidth="1.6" />
              </svg>
              Add to Cart
            </button>

            <button
              type="button"
              aria-label="Add to wishlist"
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-[#3A2417]/15 text-[#3A2417] hover:border-[#E9A331]"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 21s-7.2-4.5-9.6-9C.7 8.6 2 5 5.4 4.2 7.6 3.7 9.8 4.6 12 7c2.2-2.4 4.4-3.3 6.6-2.8C22 5 23.3 8.6 21.6 12c-2.4 4.5-9.6 9-9.6 9z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </div>

          {product.specsHref && (
            <a
              href={product.specsHref}
              className="mt-1 text-[13px] font-bold text-[#8a5a1f] underline decoration-[#E9A331]/50 underline-offset-4 hover:text-[#3A2417]"
            >
              View Full Product Specifications & Lab Report →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GemstoneProducts({
  title = "Buy Gemstones Online",
  subtitle = "Products of Trusted Excellence",
  products,
  onAddToCart,
  onAdd,
  // Optional live Shopify wiring — OFF by default, so out of the box
  // this component makes zero network calls and cannot error. Flip
  // `enabled: true` once VITE_SHOPIFY_STORE_DOMAIN and
  // VITE_SHOPIFY_STOREFRONT_TOKEN are set in your .env — see README.
  shopify = { enabled: false, collectionHandle: "gemstones", first: 12 },
  // Home-grid mode: hide price/Quick View and send clicks to the shared
  // dynamic gemstone page (/gemstone/:id) instead of opening Quick View.
  // Leave all three at their defaults anywhere you want the original,
  // full-featured card (e.g. on a gemstone's own page) — no change there.
  showPrice = true,
  showQuickView = true,
  showAddToCart = true,
  linkToDetail = false,
}) {
  const fallbackProducts = useMemo(() => products || defaultProducts, [products]);

  const { products: liveProducts } = useGemstoneProducts({
    enabled: shopify?.enabled,
    collectionHandle: shopify?.collectionHandle,
    first: shopify?.first,
    fallback: fallbackProducts,
  });

  const navigate = useNavigate();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <section className="gemstone-products bg-[#FAF6F0] px-6 py-16 sm:px-8 lg:py-20" aria-label="Buy gemstones online">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Manrope:wght@500;600;700;800&display=swap');
        .gemstone-products, .gp-modal-overlay { font-family:'Manrope', sans-serif; }
        .gemstone-products .gp-heading { font-family:'Cormorant Garamond', serif; }

        @keyframes gp-rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .gp-animate-card { animation: gp-rise 0.6s cubic-bezier(.2,.7,.2,1) both; }
        .gp-animate-card:nth-child(1) { animation-delay: 0.02s; }
        .gp-animate-card:nth-child(2) { animation-delay: 0.06s; }
        .gp-animate-card:nth-child(3) { animation-delay: 0.10s; }
        .gp-animate-card:nth-child(4) { animation-delay: 0.14s; }
        .gp-animate-card:nth-child(5) { animation-delay: 0.18s; }
        .gp-animate-card:nth-child(6) { animation-delay: 0.22s; }
        .gp-animate-card:nth-child(7) { animation-delay: 0.26s; }
        .gp-animate-card:nth-child(8) { animation-delay: 0.30s; }

        @keyframes gp-modal-in { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .gp-modal-panel { animation: gp-modal-in 0.25s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .gp-animate-card, .gp-modal-panel { animation: none; }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="gp-heading text-[2rem] font-semibold text-[#3A2417] sm:text-[2.5rem]">{title}</h2>
          <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[#8a5a1f]">{subtitle}</p>
          <div className="mx-auto mt-5 h-[3px] w-16 rounded-full bg-gradient-to-r from-[#E9A331] via-[#F5B041] to-[#F4B843]" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {liveProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
              onAdd={onAdd}
              showPrice={showPrice}
              showQuickView={showQuickView}
              showAddToCart={showAddToCart}
              onCardClick={linkToDetail ? (p) => navigate(`/gemstone/${p.id}`) : undefined}
            />
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}