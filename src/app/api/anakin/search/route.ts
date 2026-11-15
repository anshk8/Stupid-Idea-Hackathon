import { NextResponse } from "next/server";
import { AnakinError } from "@anakin-io/sdk";

import { search } from "@/lib/anakin";

export const maxDuration = 60;

/**
 * POST /api/anakin/search
 * body: { prompt: string, limit?: number }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt ?? body?.q;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 },
      );
    }

    const result = await search(prompt, {
      limit: typeof body.limit === "number" ? body.limit : undefined,
    });

    return NextResponse.json(result);
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
