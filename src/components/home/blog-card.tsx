import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { decodeEntities } from "@/lib/api/parsers";
import type { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

function getPostImage(post: BlogPost): string | undefined {
  return (
    post.featured_image_url ??
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogCard({ post }: BlogCardProps) {
  const image = getPostImage(post);
  const title = decodeEntities(post.title.rendered);
  const excerpt = decodeEntities(post.excerpt.rendered).replace(/<[^>]+>/g, "").trim();

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#ebedf1] bg-white transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block shrink-0">
        <div className="relative aspect-[19/10] w-full overflow-hidden bg-neutral-20">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-50">
              <CalendarDays className="h-10 w-10 text-primary-300" />
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1 text-xs text-neutral-400">
          <CalendarDays className="h-3 w-3" />
          <span className="font-open-sans">{formatDate(post.date)}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="line-clamp-2 font-suse font-bold leading-snug text-neutral-900 transition-colors hover:text-secondary-500">
            {title}
          </h3>
        </Link>
        {excerpt && (
          <p className="line-clamp-3 font-open-sans text-sm text-neutral-500">{excerpt}</p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto inline-flex items-center font-open-sans text-sm font-medium text-secondary-500 hover:text-secondary-600"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
