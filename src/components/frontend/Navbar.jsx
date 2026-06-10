"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Building2, Menu, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed right-0 left-0 z-50 transition-all duration-300 border-neutral-200/40 dark:border-neutral-800/40 ${
        isScrolled
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-md border md:rounded-full rounded-2xl md:top-5 top-3 md:mx-8 mx-3"
          : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md top-0 border-b"
      }`}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
            Property
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Expert
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Link href="/admin/login">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-neutral-600 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <User className="h-4 w-4" />
              Agent Login
            </Button>
          </Link>
          <Link href="/projects">
            <Button
              size="sm"
              className="gap-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 font-semibold text-white rounded-full shadow-md"
            >
              Explore Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Sheet */}
        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 border-l border-neutral-100 bg-white p-6 dark:border-neutral-800 dark:bg-zinc-950"
            >
              <SheetHeader className="pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Building2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-heading font-bold text-neutral-900 dark:text-white">
                    Property Expert
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-5 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-base font-semibold transition-colors duration-200 ${
                      isActive(link.href)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300 rounded-xl"
                  >
                    <User className="h-4 w-4" />
                    Agent Login
                  </Button>
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setMobileOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full justify-center gap-1.5 bg-indigo-600 font-semibold text-white hover:bg-indigo-700 rounded-xl">
                    Explore Projects
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
