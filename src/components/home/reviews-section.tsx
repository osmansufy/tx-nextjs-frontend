import { Star } from "lucide-react";

interface Review {
  initials: string;
  name: string;
  rating: number;
  text: string;
}

const REVIEWS: Review[] = [
  {
    initials: "VK",
    name: "Vincent Kasozi",
    rating: 5,
    text: "Loved the course, plenty of useful information. Great service, very professional and supportive staff. Would definitely recommend.",
  },
  {
    initials: "JA",
    name: "Jackie Atkin",
    rating: 5,
    text: "Very easy to understand instructions. Videos are informative and relevant to test questions. Any queries were answered within hours. Completed a housing management course at my own pace and now enrolled onto another course.",
  },
  {
    initials: "AS",
    name: "Attila Szep",
    rating: 5,
    text: "I can gladly recommend it to anyone! I have been using Training Excellence regularly for quite some time now. Personally, I am very satisfied. I always find an interesting and appropriate course that meets my expectations.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-30"}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-neutral-10 py-16">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Google reviews badge placeholder */}
          <div className="flex shrink-0 flex-col items-start gap-3 rounded-xl border border-neutral-30 bg-white p-6 lg:w-[220px]">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                <span className="font-suse font-bold text-neutral-900">G</span>
              </div>
              <div>
                <p className="font-open-sans text-xs font-semibold text-neutral-900">Google</p>
                <p className="font-open-sans text-xs text-neutral-400">Reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-open-sans text-3xl font-bold text-neutral-900">4.8</span>
            </div>
            <StarRating rating={5} />
            <a
              href="https://g.page/r/training-excellence"
              target="_blank"
              rel="noopener noreferrer"
              className="font-open-sans text-xs font-medium text-secondary-500 hover:underline"
            >
              View more reviews
            </a>
          </div>

          {/* Review cards */}
          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="flex flex-col gap-4 rounded-xl border border-neutral-30 bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <span className="font-suse text-xl font-bold text-neutral-900">
                      {review.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-open-sans font-semibold text-neutral-900">{review.name}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="font-open-sans text-sm leading-relaxed text-neutral-500">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
