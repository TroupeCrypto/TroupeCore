import { NextResponse } from "next/server";
import { financeData } from "../../../../../lib/data/vault";

export function GET() {
  return NextResponse.json({ data: financeData });
}
