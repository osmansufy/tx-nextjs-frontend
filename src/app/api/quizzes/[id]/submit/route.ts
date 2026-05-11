import { NextResponse } from "next/server";
import { proxyToWP } from "@/lib/api/bff";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id?.trim()) return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
  const body = await req.json();
  return proxyToWP(`/quizzes/${encodeURIComponent(id)}/submit`, { method: "POST", body });
}
