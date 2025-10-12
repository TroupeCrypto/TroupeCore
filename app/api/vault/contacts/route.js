import { NextResponse } from "next/server";
import { contactData } from "../../../../../lib/data/vault";

export function GET() {
  return NextResponse.json({ data: contactData });
}
