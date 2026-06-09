import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-neutral-300 dark:border-neutral-900">
      <div className="bg-neutral-900/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-300 max-w-2xl">
            Personalized advisory, premium search filters, and verified luxury
            projects for discerning homeowners and investors.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
            <span className="inline-flex items-center rounded-full border border-neutral-700/90 bg-white/5 px-3 py-1.5 text-neutral-300">
              Trusted by premium buyers worldwide
            </span>
          </div>
        </div>
      </div>
      {/* Upper Footer: Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white sm:text-xl">
                Property<span className="text-indigo-400">Expert</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-6 max-w-xs">
              Exceptional real estate services to help you find, buy, and list
              premium properties. Experience the luxury of simplicity.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  className="h-5 w-5 stroke-current fill-none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-heading">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors duration-200"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white transition-colors duration-200"
                >
                  Agent Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-heading">
              Project Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/projects?category=apartment"
                  className="hover:text-white transition-colors duration-200"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=villa"
                  className="hover:text-white transition-colors duration-200"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=commercial"
                  className="hover:text-white transition-colors duration-200"
                >
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=penthouse"
                  className="hover:text-white transition-colors duration-200"
                >
                  Penthouses
                </Link>
              </li>
              <li>
                <Link
                  href="/projects?category=land"
                  className="hover:text-white transition-colors duration-200"
                >
                  Lands / Plots
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-heading">
              Contact Info
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Lower Parel, Mumbai,
                  <br />
                  Maharashtra 400013
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>+91 (22) 4040-4040</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="truncate">contact@Property Expert.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright bar */}
      <div className="border-t border-neutral-800 py-8 dark:border-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            &copy; {currentYear} Property Expert. All rights reserved. Made with
            love for premium living.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
