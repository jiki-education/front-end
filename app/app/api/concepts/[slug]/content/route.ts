import { NextResponse } from "next/server";
import { getConceptContent } from "@/lib/concepts/api-helpers";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=600, s-maxage=600"
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const content = await getConceptContent(slug, locale);
  return NextResponse.json({ content }, { headers: CACHE_HEADERS });
}
