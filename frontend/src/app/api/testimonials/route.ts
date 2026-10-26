import { NextResponse } from "next/server";
import testimonialsData from "@/data/testimonials.json";

export async function GET() {
  return NextResponse.json(testimonialsData);
}
