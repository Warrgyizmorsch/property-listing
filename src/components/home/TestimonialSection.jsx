import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Victoria Sterling",
      role: "Luxury Property Investor",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
      quote:
        "LuxeEstates provided an elite level of service. They parsed our exact requirements and secured a stunning penthouse overlooking Mumbai before it hit public indexes.",
      rating: 5,
    },
    {
      name: "Marcus Vance",
      role: "Founder, Capital Tech",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
      quote:
        "The transparency and transaction guidance was refreshing. As a first-time buyer in NY, their certified agents simplified every legal stage with extreme clarity.",
      rating: 5,
    },
    {
      name: "Evelyn Thorne",
      role: "Interior Designer",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
      quote:
        "Finding high-end commercial office space that matches our strict visual design directives was a challenge. LuxeEstates pinpointed three perfect units within 48 hours.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-neutral-50 py-20 px-4 dark:bg-zinc-900/10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            Success Stories
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-base leading-6">
            Hear from property buyers, sellers, and luxury investors who reached
            their property milestones with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 rounded-2xl border border-neutral-100 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/20"
            >
              {/* Quote details */}
              <div className="relative">
                <Quote className="absolute -left-2 -top-2 h-8 w-8 text-neutral-100 dark:text-zinc-850 shrink-0" />

                {/* Rating */}
                <div className="relative z-10 flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0"
                    />
                  ))}
                </div>

                {/* Quote text */}
                <p className="relative z-10 text-sm leading-6 text-neutral-600 dark:text-neutral-300 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* User profile */}
              <div className="mt-8 flex items-center gap-3.5 border-t border-neutral-100 pt-6 dark:border-neutral-800/80">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-neutral-100">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
