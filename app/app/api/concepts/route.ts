import { NextResponse } from "next/server";
import { getConcepts } from "@/lib/concepts/api-helpers";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=600, s-maxage=600"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const concepts = await getConcepts(locale);
  return NextResponse.json(concepts, { headers: CACHE_HEADERS });
}
