import { NextResponse } from "next/server";
import { AnakinError } from "@anakin-io/sdk";

import { scrape } from "@/lib/anakin";

export const maxDuration = 120;

/**
 * POST /api/anakin/scrape
 * body: { url: string, useBrowser?: boolean, generateJson?: boolean, country?: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const doc = await scrape(url, {
      useBrowser: Boolean(body.useBrowser),
      generateJson: Boolean(body.generateJson),
      country: typeof body.country === "string" ? body.country : undefined,
      formats: Array.isArray(body.formats) ? body.formats : undefined,
    });

    return NextResponse.json(doc);
  } catch (err) {
    return toErrorResponse(err);
  }
}

function toErrorResponse(err: unknown) {
  if (err instanceof AnakinError) {
    return NextResponse.json(
      {
        error: err.message,
        code: err.code,
        statusCode: err.statusCode,
      },
      { status: err.statusCode && err.statusCode >= 400 ? err.statusCode : 502 },
    );
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  const status = message.includes("ANAKIN_API_KEY") ? 500 : 502;
  return NextResponse.json({ error: message }, { status });
}
