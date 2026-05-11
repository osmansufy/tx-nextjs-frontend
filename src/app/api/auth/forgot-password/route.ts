import { NextResponse } from "next/server";
import { endpoints } from "@/lib/api/endpoints";
import { getServerWpJsonBase } from "@/lib/env";

export async function POST(request: Request) {
  const base = getServerWpJsonBase();
  if (!base) {
    return NextResponse.json({ error: "WordPress API URL is not configured" }, { status: 500 });
  }

  const body = await request.json();
  const wpRes = await fetch(`${base}${endpoints.auth.forgotPassword}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await wpRes.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!wpRes.ok || json.success === false) {
    return NextResponse.json(
      { error: json.message ?? "Request failed" },
      { status: wpRes.ok ? 400 : wpRes.status },
    );
  }

  return NextResponse.json({ ok: true });
}
