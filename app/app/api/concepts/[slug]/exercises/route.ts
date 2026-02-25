import { NextResponse } from "next/server";
import { getExercisesForConcept } from "@/lib/concepts/api-helpers";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=600, s-maxage=600"
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const exercises = await getExercisesForConcept(slug, locale);
  return NextResponse.json(exercises, { headers: CACHE_HEADERS });
}
