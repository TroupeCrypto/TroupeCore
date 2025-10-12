import { NextResponse } from "next/server";
import { onlineData } from "../../../../../lib/data/vault";

export function GET() {
  return NextResponse.json({ data: onlineData });
}
