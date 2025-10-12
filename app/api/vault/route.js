import { NextResponse } from "next/server";
import { vaultDataset } from "../../../../lib/data/vault";

export function GET() {
  return NextResponse.json({ data: vaultDataset });
}
