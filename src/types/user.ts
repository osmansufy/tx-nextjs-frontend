export interface AuthUser {
  email: string;
  displayName: string;
  nicename: string;
}

export interface WpUser {
  id: number;
  username?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  url?: string;
  description?: string;
  link?: string;
  slug: string;
  avatar_urls?: Record<string, string>;
  meta?: Record<string, unknown>;
  roles?: string[];
}
