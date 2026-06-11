import { searchCast } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ people: [] });
  }

  try {
    const people = await searchCast(query);
    return NextResponse.json({ people });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to search cast.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
