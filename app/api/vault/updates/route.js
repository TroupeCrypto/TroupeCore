import { NextResponse } from "next/server";
import { updateItems } from "@lib/data/vault";

export function GET() {
  return NextResponse.json({ data: updateItems });
}
