import { NextResponse } from "next/server";
import { proxyToWP } from "@/lib/api/bff";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id?.trim()) return NextResponse.json({ error: "Missing quiz id" }, { status: 400 });
  return proxyToWP(`/quizzes/${encodeURIComponent(id)}/questions`);
}
