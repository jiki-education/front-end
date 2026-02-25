import { NextResponse } from "next/server";
import { getContentLoader } from "@/lib/content/loaders";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=600, s-maxage=600"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const loader = await getContentLoader();
  const searchIndex = await loader.getSearchIndex("articles", locale);
  return NextResponse.json(searchIndex, { headers: CACHE_HEADERS });
}
