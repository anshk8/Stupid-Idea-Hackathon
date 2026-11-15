import "server-only";

import type {
  AgenticSearchOptions,
  AgenticSearchResult,
  Document,
  ScrapeOptions,
  SearchOptions,
  SearchResult,
} from "@anakin-io/sdk";

import { anakin, getAnakin } from "./client";

export { anakin, getAnakin };
export type {
  AgenticSearchOptions,
  AgenticSearchResult,
  Document,
  ScrapeOptions,
  SearchOptions,
  SearchResult,
};

/**
 * One-liners — drop these anywhere on the server:
 *
 *   import { scrape, search, extract } from "@/lib/anakin"
 *   const md = (await scrape("https://example.com")).markdown
 *   const hits = await search("Jensen Huang affairs")
 *   const data = await extract(url, { schema: { … } })
 */

/** Scrape a URL → markdown / html / optional AI JSON (handles job polling). */
export function scrape(url: string, options?: ScrapeOptions): Promise<Document> {
  return getAnakin().scrape(url, options);
}

/** AI web search with citations (sync). */
export function search(
  prompt: string,
  options?: SearchOptions,
): Promise<SearchResult> {
  return getAnakin().search(prompt, options);
}

export type ExtractOptions = Omit<ScrapeOptions, "generateJson"> & {
  /** JSON Schema for structured extraction (implies generateJson). */
  schema?: Record<string, unknown>;
};

/**
 * Scrape + AI extract structured JSON.
 * Pass `schema` when you need a specific shape (e.g. { affairs: number }).
 */
export async function extract(
  url: string,
  options: ExtractOptions = {},
): Promise<Record<string, unknown> | undefined> {
  const { schema, ...rest } = options;

  if (schema) {
    // SDK ScrapeOptions doesn't expose outputSchema yet — hit the sync REST path.
    return extractWithSchema(url, schema, rest);
  }

  const doc = await getAnakin().scrape(url, {
    ...rest,
    generateJson: true,
  });

  if (doc.status === "failed") {
    throw new Error(doc.error ?? `Anakin extract failed for ${url}`);
  }

  return doc.generatedJson;
}

async function extractWithSchema(
  url: string,
  schema: Record<string, unknown>,
  options: Omit<ExtractOptions, "schema">,
): Promise<Record<string, unknown> | undefined> {
  const apiKey = process.env.ANAKIN_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANAKIN_API_KEY");
  }

  const base = process.env.ANAKIN_API_BASE ?? "https://api.anakin.io/v1";

  const res = await fetch(`${base}/url-scraper/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      url,
      generateJson: true,
      outputSchema: schema,
      country: options.country ?? "us",
      useBrowser: options.useBrowser ?? false,
      sessionId: options.sessionId,
      sessionName: options.sessionName,
    }),
  });

  const data = (await res.json()) as {
    id?: string;
    status?: string;
    generatedJson?: Record<string, unknown>;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error ?? `Anakin extract HTTP ${res.status}`);
  }

  // Inline scrape can return still-running payload — fall back to SDK poll path
  if (data.status && data.status !== "completed" && data.status !== "failed") {
    const polled = await getAnakin().scrape(url, {
      ...options,
      generateJson: true,
    });
    return polled.generatedJson;
  }

  if (data.status === "failed") {
    throw new Error(data.error ?? `Anakin extract failed for ${url}`);
  }

  return data.generatedJson;
}

/** Deep multi-source research (slow, 1–5 min). */
export function research(
  prompt: string,
  options?: AgenticSearchOptions,
): Promise<AgenticSearchResult> {
  return getAnakin().agenticSearch(prompt, options);
}
