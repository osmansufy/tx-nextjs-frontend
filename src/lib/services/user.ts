import { bffJson } from "@/lib/api/bff-client";
import type { WpUser } from "@/types/user";

interface UpdateMePayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  description?: string;
  url?: string;
  email?: string;
  password?: string;
}

export const userService = {
  async me(): Promise<WpUser> {
    return bffJson<WpUser>("/api/users/me", { method: "GET" });
  },

  async updateMe(payload: UpdateMePayload): Promise<WpUser> {
    return bffJson<WpUser>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
