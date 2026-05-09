import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthUser, WpUser } from "@/types/user";

interface JwtTokenResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  async login(input: { username: string; password: string }): Promise<{
    token: string;
    user: AuthUser;
  }> {
    const { data } = await api.post<JwtTokenResponse>(endpoints.auth.token, input);
    return {
      token: data.token,
      user: {
        email: data.user_email,
        displayName: data.user_display_name,
        nicename: data.user_nicename,
      },
    };
  },

  async validate(): Promise<boolean> {
    try {
      await api.post(endpoints.auth.validate);
      return true;
    } catch {
      return false;
    }
  },

  async register(payload: RegisterPayload): Promise<WpUser> {
    const { data } = await api.post<WpUser>(endpoints.auth.register, payload);
    return data;
  },

  async me(): Promise<WpUser> {
    const { data } = await api.get<WpUser>(endpoints.auth.me);
    return data;
  },
};
