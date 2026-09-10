import { useEffect, useState } from "react";
import { shopifyFetch, isShopifyConfigured } from "../lib/shopifyClient";

/**
 * useGemstoneProducts
 * ------------------------------------------------------------------
 * Optionally pulls real product cards from a Shopify collection
 * (Storefront API) and maps them onto the exact shape <ProductCard />
 * expects. Same safety contract as useGemstoneFinderOptions:
 *
 *  - `enabled: false` (default) → never touches the network, just
 *    returns the sample/prop products you already pass in.
 *  - Missing store/token, bad collection handle, failed request, or
 *    an empty collection → silently falls back to the sample
 *    products (with a console.warn for you to debug). A site visitor
 *    never sees an error state or a blank grid.
 *
 * Rating/reviews and the "Lab Certified" line aren't native Shopify
 * product fields, so they're read from metafields if you have them
 * (configure the identifiers via `metafields`); any product missing
 * those simply falls back to a default rating/cert line instead of
 * hiding them.
 * ------------------------------------------------------------------
 */

const PRODUCTS_QUERY = `
  query GemstoneProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              url
              altText
            }
            images(first: 6) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            ratingMeta: metafield(namespace: "reviews", key: "rating") {
              value
            }
            reviewsMeta: metafield(namespace: "reviews", key: "rating_count") {
              value
            }
            certMeta: metafield(namespace: "custom", key: "certification") {
              value
            }
          }
        }
      }
    }
  }
`;

function formatINR(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return null;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function toProduct(node, fallbackDefaults) {
  const price = Number(node?.priceRange?.minVariantPrice?.amount);
  const compareAt = Number(node?.compareAtPriceRange?.minVariantPrice?.amount);
  const hasDiscount = compareAt > price;
  const discountPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const sizeOption = node.variants?.edges
    ?.flatMap((e) => e.node.selectedOptions)
    ?.find((o) => /size|fitting/i.test(o.name));

  return {
    id: node.id,
    name: node.title,
    benefit: (node.description || "").split("\n")[0]?.slice(0, 90) || fallbackDefaults.benefit,
    image: node.featuredImage?.url || fallbackDefaults.image,
    gallery: node.images?.edges?.map((e) => e.node.url) || fallbackDefaults.gallery,
    price: formatINR(price) || fallbackDefaults.price,
    originalPrice: hasDiscount ? formatINR(compareAt) : fallbackDefaults.originalPrice,
    badge: hasDiscount ? `${discountPct}% OFF` : fallbackDefaults.badge,
    rating: Number(node.ratingMeta?.value) || fallbackDefaults.rating,
    reviews: Number(node.reviewsMeta?.value) || fallbackDefaults.reviews,
    certification: node.certMeta?.value || fallbackDefaults.certification,
    sizeOptionLabel: sizeOption?.name || fallbackDefaults.sizeOptionLabel,
    sizeOptionValue: sizeOption?.value || fallbackDefaults.sizeOptionValue,
    description: node.description || fallbackDefaults.description,
    fallbackFrom: fallbackDefaults.fallbackFrom,
    fallbackTo: fallbackDefaults.fallbackTo,
  };
}

export function useGemstoneProducts({ enabled, collectionHandle, first = 12, fallback }) {
  const [state, setState] = useState({
    products: fallback,
    loading: Boolean(enabled),
    source: "fallback",
  });

  useEffect(() => {
    if (!enabled) {
      setState({ products: fallback, loading: false, source: "fallback" });
      return;
    }

    if (!isShopifyConfigured || !collectionHandle) {
      console.warn(
        "[GemstoneProducts] Shopify not configured or no collectionHandle passed — using fallback demo products."
      );
      setState({ products: fallback, loading: false, source: "fallback" });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    shopifyFetch(PRODUCTS_QUERY, { handle: collectionHandle, first }).then(({ data, error }) => {
      if (cancelled) return;

      const edges = data?.collection?.products?.edges;

      if (error || !edges?.length) {
        if (error) {
          console.warn("[GemstoneProducts] Shopify product fetch failed — using fallback demo products:", error.message);
        } else {
          console.warn(`[GemstoneProducts] Collection "${collectionHandle}" has no products — using fallback demo products.`);
        }
        setState({ products: fallback, loading: false, source: "fallback" });
        return;
      }

      try {
        const mapped = edges.map((e, i) => toProduct(e.node, fallback[i % fallback.length]));
        setState({ products: mapped, loading: false, source: "shopify" });
      } catch (err) {
        console.warn("[GemstoneProducts] Could not map Shopify products — using fallback demo products:", err);
        setState({ products: fallback, loading: false, source: "fallback" });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, collectionHandle, first, fallback]);

  return state;
}