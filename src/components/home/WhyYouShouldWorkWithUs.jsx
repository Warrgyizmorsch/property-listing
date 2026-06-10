"use client";

import React from "react";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export default function WhyYouShouldWorkWithUs() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Image with Stats */}
        <div className="relative rounded-2xl overflow-hidden shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
            alt="Modern House"
            className="w-full md:h-[570px] h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 rounded-2xl shadow-md flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
              <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                Total Clients
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                15,000+
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Why You Should Work <br /> With Us
          </h2>
          <p className="text-gray-600 dark:text-gray-450 mb-8 leading-relaxed">
            Our expert advisory services help you search, locate, and finalize the most premium verified real estate projects seamlessly. We combine detailed listings, pricing transparently, and developer-direct contact channels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-lg">
                Explore Projects
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-405">
                We present the finest hand-picked projects in top locations with detailed unit availability statistics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-lg">
                Trusted Advisors
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-405">
                Our certified advisory agents work closely with top-tier developers to fetch the best pricing options for you.
              </p>
            </div>
          </div>

          <Link href="/about">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition shadow-md">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
