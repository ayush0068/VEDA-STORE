import { useEffect, useState } from "react";
import { shopifyFetch, isShopifyConfigured } from "../lib/shopifyClient";

/**
 * useGemstoneFinderOptions
 * ------------------------------------------------------------------
 * Optionally pulls real dropdown values from a Shopify collection's
 * product filters (Shopify's native faceted-filtering feature), and
 * maps them onto the finder's five dropdowns via `filterMap`.
 *
 * Safe by design:
 *  - If `enabled` is false (default), it never calls the network —
 *    it just returns the sample/prop options you already pass in.
 *  - If Shopify isn't configured, the collection handle is missing,
 *    the request fails, or a mapped filter simply doesn't exist on
 *    that collection, it silently falls back to the sample options
 *    for that field (with a console.warn for debugging) — it never
 *    throws and never shows an error to the site visitor.
 * ------------------------------------------------------------------
 */
const FILTERS_QUERY = `
  query GemstoneFinderFilters($handle: String!) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          id
          label
          values {
            id
            label
            count
          }
        }
      }
    }
  }
`;

function toOptions(values = []) {
  return values.map((v) => ({
    value: v.id,
    label: v.count ? `${v.label} (${v.count})` : v.label,
  }));
}

export function useGemstoneFinderOptions({ enabled, collectionHandle, filterMap, fallback }) {
  const [state, setState] = useState({
    options: fallback,
    loading: Boolean(enabled),
    source: "fallback",
  });

  useEffect(() => {
    if (!enabled) {
      setState({ options: fallback, loading: false, source: "fallback" });
      return;
    }

    if (!isShopifyConfigured || !collectionHandle) {
      console.warn(
        "[GemstoneHero] Shopify not configured or no collectionHandle passed — using fallback dropdown options."
      );
      setState({ options: fallback, loading: false, source: "fallback" });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    shopifyFetch(FILTERS_QUERY, { handle: collectionHandle }).then(({ data, error }) => {
      if (cancelled) return;

      if (error || !data?.collection) {
        if (error) {
          console.warn("[GemstoneHero] Shopify filter fetch failed — using fallback dropdown options:", error.message);
        }
        setState({ options: fallback, loading: false, source: "fallback" });
        return;
      }

      const filters = data.collection.products?.filters ?? [];
      const next = { ...fallback };

      Object.entries(filterMap ?? {}).forEach(([field, filterId]) => {
        const match = filters.find((f) => f.id === filterId || f.label === filterId);
        if (match?.values?.length) {
          next[field] = toOptions(match.values);
        } else {
          console.warn(`[GemstoneHero] No Shopify filter found for "${field}" (looked for "${filterId}") — keeping fallback options for this dropdown.`);
        }
      });

      setState({ options: next, loading: false, source: "shopify" });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, collectionHandle, JSON.stringify(filterMap)]);

  return state;
}