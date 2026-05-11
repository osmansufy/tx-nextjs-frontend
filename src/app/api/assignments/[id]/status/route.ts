import { NextResponse } from "next/server";
import { proxyToWP } from "@/lib/api/bff";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id?.trim()) return NextResponse.json({ error: "Missing assignment id" }, { status: 400 });
  return proxyToWP(`/assignments/${encodeURIComponent(id)}/status`);
}
