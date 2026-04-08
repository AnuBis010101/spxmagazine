import { NextResponse } from "next/server";
import { getGlossaryTerms } from "@/lib/queries/glossary";

export const dynamic = "force-dynamic";

export async function GET() {
  const terms = await getGlossaryTerms();
  return NextResponse.json(
    terms.map((t) => ({ term: t.term, slug: t.slug, definition: t.definition })),
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
