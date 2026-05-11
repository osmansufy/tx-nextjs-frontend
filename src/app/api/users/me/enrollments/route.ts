import { proxyToWP } from "@/lib/api/bff";

export async function GET() {
  return proxyToWP("/users/me/enrollments");
}
