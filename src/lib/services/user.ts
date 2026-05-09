import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
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
    const { data } = await api.get<WpUser>(endpoints.user.me);
    return data;
  },

  async updateMe(payload: UpdateMePayload): Promise<WpUser> {
    const { data } = await api.post<WpUser>(endpoints.user.update, payload);
    return data;
  },
};
