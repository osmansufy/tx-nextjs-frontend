export interface BlogPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_image_url?: string;
  link: string;
  categories?: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
}
