export interface SiteFeatures {
  memberships: boolean;
  bundles: boolean;
  certificates: boolean;
  badges: boolean;
  reviews: boolean;
  blog: boolean;
}

export interface SiteSocial {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface SiteSettings {
  site_name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  og_image_url?: string;
  primary_color?: string;
  accent_color?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social?: SiteSocial;
  currency: string;
  locale: string;
  features: SiteFeatures;
}

/** Merged effective settings: API response overridden by env vars. */
export type EffectiveSettings = SiteSettings;
