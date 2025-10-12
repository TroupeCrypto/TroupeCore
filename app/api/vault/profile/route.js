import { NextResponse } from "next/server";
import { profileData } from "lib/data/vault";

export function GET() {
  return NextResponse.json({ data: profileData });
}
