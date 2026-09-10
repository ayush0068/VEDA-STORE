/**
 * Minimal Shopify Storefront API client.
 * ------------------------------------------------------------------
 * Reads credentials from Vite env vars (never hard-coded, never a
 * secret token — the Storefront API token is meant to be public /
 * client-side safe, unlike the Admin API token).
 *
 * Required in your .env (see .env.example):
 *   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *
 * This file NEVER throws. Every function returns
 * { data, error } — callers decide what to do on error (in this
 * project: silently fall back to sample options, never crash the UI
 * or show a broken page to a visitor).
 * ------------------------------------------------------------------
 */

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-10";

export const isShopifyConfigured = Boolean(domain && token);

export async function shopifyFetch(query, variables = {}) {
  if (!isShopifyConfigured) {
    return {
      data: null,
      error: new Error(
        "Shopify Storefront API not configured — set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in .env"
      ),
    };
  }

  try {
    const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      return { data: null, error: new Error(`Shopify Storefront API responded with ${res.status}`) };
    }

    const json = await res.json();

    if (json.errors?.length) {
      return { data: null, error: new Error(json.errors.map((e) => e.message).join("; ")) };
    }

    return { data: json.data, error: null };
  } catch (err) {
    // Network failure, CORS issue, bad token, store paused, etc.
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}