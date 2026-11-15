import { NextResponse } from "next/server";
import { AnakinError } from "@anakin-io/sdk";

import { extract } from "@/lib/anakin";

export const maxDuration = 120;

/**
 * POST /api/anakin/extract
 * body: {
 *   url: string,
 *   schema?: object,       // JSON Schema → structured fields
 *   useBrowser?: boolean,
 *   country?: string
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const generatedJson = await extract(url, {
      schema:
        body.schema && typeof body.schema === "object" ? body.schema : undefined,
      useBrowser: Boolean(body.useBrowser),
      country: typeof body.country === "string" ? body.country : undefined,
    });

    return NextResponse.json({ url, generatedJson });
  } catch (err) {
    if (err instanceof AnakinError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode && err.statusCode >= 400 ? err.statusCode : 502 },
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
