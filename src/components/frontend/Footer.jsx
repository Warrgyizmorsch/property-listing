"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { subscribeNewsletterAction } from "@/features/enquiries/public/actions/newsletter.actions";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [subEmail, setSubEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!subEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await subscribeNewsletterAction(subEmail);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("You're subscribed! Welcome aboard 🎉");
        setSubscribed(true);
        setSubEmail("");
        // Reset the success state after 4 seconds
        setTimeout(() => setSubscribed(false), 4000);
      }
    } catch (err) {
      console.error("Newsletter subscribe error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[var(--primary)] text-gray-300 pt-16 border-t border-[rgba(200,164,93,0.16)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/PE-Logo-white.png" alt="Property Expert" width={180} height={60} className="h-15 w-auto" priority />
          </Link>

          {/* Social Icons */}
          <div className="flex items-center space-x-5 text-gray-400">
            <span className="text-sm text-gray-350 font-semibold uppercase tracking-wider">Follow Us</span>

            {/* Facebook inline SVG */}
            <a
              href="https://www.facebook.com/profile.php?id=61591240026997"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-secondary)] hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>

            {/* Twitter inline SVG */}
            <span className="cursor-pointer hover:text-[var(--brand-secondary)] hover:-translate-y-0.5 transition-all duration-200" aria-hidden="true">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </span>

            {/* Instagram inline SVG */}
            <a
              href="https://www.instagram.com/propertyexpertudaipur/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-secondary)] hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn inline SVG */}
            <span className="cursor-pointer hover:text-[var(--brand-secondary)] hover:-translate-y-0.5 transition-all duration-200" aria-hidden="true">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </span>
          </div>
        </div>

        <hr className="border-neutral-800 my-8" />

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Subscribe */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Subscribe
            </h3>
            <form onSubmit={handleSubscribe}>
              <div className="flex items-center bg-[#1d1d1d] rounded-full border border-neutral-800 overflow-hidden pl-4 pr-1 py-1 transition-all duration-300 focus-within:border-[var(--brand-secondary)]/50 focus-within:shadow-[0_0_12px_rgba(200,164,93,0.15)]">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoComplete="off"
                  className="bg-transparent py-1 text-sm flex-1 focus:outline-none text-white placeholder-gray-500 min-w-0 disabled:opacity-50 autofill:shadow-[inset_0_0_0px_1000px_#1d1d1d] autofill:[-webkit-text-fill-color:white] autofill:[caret-color:white]"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || subscribed}
                  className="primary-btn px-4 py-1.5 text-xs text-white bg-[#102642] rounded-full! transition-all duration-300 shrink-0 font-bold cursor-pointer hover:transform-none! active:transform-none! disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : subscribed ? (
                    <span className="flex items-center gap-1 animate-in zoom-in-50 duration-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                      <span className="text-green-400">Done</span>
                    </span>
                  ) : (
                    "Send →"
                  )}
                </Button>
              </div>
            </form>
            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
              Subscribe to our newsletter to receive our weekly curated premium project updates.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Categories
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/projects?category=apartment" className="hover:text-white transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/projects?category=villa" className="hover:text-white transition-colors">
                  Villas
                </Link>
              </li>
              <li>
                <Link href="/projects?category=commercial" className="hover:text-white transition-colors">
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link href="/projects?category=penthouse" className="hover:text-white transition-colors">
                  Penthouses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Address */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Contact Info
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-[var(--brand-secondary)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Lower Parel, Mumbai,
                  <br />
                  Maharashtra 400013
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-[var(--brand-secondary)] shrink-0" />
                <span>+91 (22) 4040-4040</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-[var(--brand-secondary)] shrink-0" />
                <span className="truncate">contact@propertyexpert.com</span>
              </li>
            </ul>
          </div>

          {/* Column 5: App Buttons (Commented Out) */}
          {/*
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Get the app
            </h3>
            <div className="flex flex-col space-y-3">
              <span className="bg-[#102642] border border-[rgba(200,164,93,0.18)] flex items-center justify-center px-4 py-2 rounded-xl transition">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                  width={18}
                  height={18}
                  alt="apple store icon"
                  unoptimized
                />
                <span className="ml-2 text-xs font-semibold text-white">Apple Store</span>
              </span>
              <span className="bg-[#102642] border border-[rgba(200,164,93,0.18)] flex items-center justify-center px-4 py-2 rounded-xl transition">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                  width={18}
                  height={18}
                  alt="google play store icon"
                  unoptimized
                />
                <span className="ml-2 text-xs font-semibold text-white">Google Play</span>
              </span>
            </div>
          </div>
          */}
        </div>

        <hr className="border-neutral-800 mt-16" />

        {/* Copyright section */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className="text-center md:text-left pl-12 md:pl-0">
            &copy; {currentYear} Property Expert. All rights reserved. Made for premium living.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
