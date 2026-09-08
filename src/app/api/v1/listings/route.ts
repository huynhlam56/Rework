import { NextResponse } from "next/server";
import { listActiveListings } from "@/lib/services/listings";

export async function GET() {
  const listings = await listActiveListings();
  return NextResponse.json({ listings });
}
