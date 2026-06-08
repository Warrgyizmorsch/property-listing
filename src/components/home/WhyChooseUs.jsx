import { Shield, Sparkles, Handshake, Search } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Premium Selection",
      description:
        "We Hand-select every villa, penthouse, and commercial unit to guarantee premium quality, design standard, and value.",
      icon: (
        <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
      ),
    },
    {
      title: "Trusted Security",
      description:
        "Every listing is meticulously verified by our legal experts to safeguard your investment from any unexpected issues.",
      icon: (
        <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
    },
    {
      title: "Professional Agents",
      description:
        "Our certified real estate agents guide you step-by-step from initial search mapping to contract completion.",
      icon: (
        <Handshake className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      ),
    },
    {
      title: "Personalized Search",
      description:
        "Dynamic filters, precise geolocation parsing, and instant alerts matching your strict budget brackets.",
      icon: <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    },
  ];

  return (
    <section
      id="about"
      className="bg-white py-20 px-4 dark:bg-zinc-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
            Why Partner With Us
          </span>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Redefining Luxury Real Estate
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-base leading-6">
            We provide a transparent, end-to-end purchasing and leasing service
            crafted for discerning clients seeking excellence.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50 shadow-xs transition-all duration-300 hover:border-neutral-200 dark:border-zinc-800 dark:bg-zinc-900/10 dark:hover:border-zinc-800"
            >
              {/* Icon Container */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-neutral-100 shadow-xs dark:bg-zinc-900 dark:border-zinc-800">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-base font-semibold text-neutral-950 dark:text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
