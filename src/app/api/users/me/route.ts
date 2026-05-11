import { proxyToWP } from "@/lib/api/bff";

export async function GET() {
  return proxyToWP("/users/me");
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return proxyToWP("/users/me", { method: "PATCH", body });
}
