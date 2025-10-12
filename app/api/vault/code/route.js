import { NextResponse } from "next/server";
import { codeData } from "/lib/data/vault";

export function GET() {
  return NextResponse.json({ data: codeData });
}
