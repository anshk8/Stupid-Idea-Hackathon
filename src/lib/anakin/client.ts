import "server-only";

import { Anakin } from "@anakin-io/sdk";

/**
 * Shared Anakin client (server-only).
 *
 * Auth: ANAKIN_API_KEY (ak-…) from https://anakin.io/dashboard
 * Docs: https://anakin.io/docs/api-reference
 * Base: https://api.anakin.io/v1  ·  Header: X-API-Key
 */
let cached: Anakin | null = null;

export function getAnakin(): Anakin {
  if (cached) return cached;

  const apiKey = process.env.ANAKIN_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing ANAKIN_API_KEY. Add it to .env.local (starts with ak-). Get one at https://anakin.io/dashboard",
    );
  }

  cached = new Anakin({
    apiKey,
    baseUrl: process.env.ANAKIN_API_BASE ?? "https://api.anakin.io/v1",
    // scrapes can take a while; keep Next route maxDuration in sync
    timeoutMs: Number(process.env.ANAKIN_TIMEOUT_MS ?? 120_000),
    pollTimeoutMs: Number(process.env.ANAKIN_POLL_TIMEOUT_MS ?? 180_000),
  });

  return cached;
}

/** Pre-bound singleton — use after env is loaded (API routes / server actions). */
export const anakin = new Proxy({} as Anakin, {
  get(_target, prop, receiver) {
    const client = getAnakin();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
