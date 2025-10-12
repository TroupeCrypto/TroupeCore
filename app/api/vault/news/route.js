import { NextResponse } from "next/server";
import { newsItems } from "../../../../lib/data/vault.js";

export function GET() {
  return NextResponse.json({ data: newsItems });
}