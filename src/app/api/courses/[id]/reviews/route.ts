import { NextResponse } from "next/server";
import { proxyToWP } from "@/lib/api/bff";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id?.trim()) return NextResponse.json({ error: "Missing course id" }, { status: 400 });
  return proxyToWP(`/courses/${encodeURIComponent(id)}/reviews`, { requiresAuth: false });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id?.trim()) return NextResponse.json({ error: "Missing course id" }, { status: 400 });
  const body = await req.json();
  return proxyToWP(`/courses/${encodeURIComponent(id)}/reviews`, { method: "POST", body });
}
