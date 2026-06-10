"use client";

import React from "react";
import { Search, Users, KeyRound } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Find Real Estate",
    description:
      "Find your perfect home or investment property by searching through our wide catalog of verified listings.",
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Meet Realtor",
    description:
      "Connect with our certified property experts and advisory agents to receive personalized guidance and support.",
  },
  {
    icon: <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Take The Keys",
    description:
      "Finalize the legalities smoothly and take the keys to your dream property with complete peace of mind.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-heading">
          How It works? Find a perfect home
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-5 md:mb-12 mt-2 text-center">
          Follow three simple steps to secure your dream space
        </p>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Text Content */}
          <div>
            <div className="space-y-8 border-l-[1px] border-gray-300 dark:border-neutral-700 md:pl-8 pl-3 md:py-14 py-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="space-y-2">
                    <div className="flex-shrink-0">{step.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 md:w-[80%]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
              alt="Modern apartment"
              className="w-full md:h-[570px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
