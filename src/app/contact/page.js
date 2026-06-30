"use client";

import { useState } from "react";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPublicEnquiryAction } from "@/features/enquiries/public/actions/enquiry.public.actions";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field for spam prevention
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsPending(true);

    try {
      // Append the interest selection to the message text so it goes to the backend cleanly
      const messageBody = interest
        ? `[Property Interest: ${interest.toUpperCase()}]\n\n${message}`
        : message;

      const result = await createPublicEnquiryAction({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: messageBody.trim(),
        website: website.trim(), // Send honeypot value
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Thank you! Your message has been sent successfully. 🎉");
        // Reset fields
        setName("");
        setEmail("");
        setPhone("");
        setInterest("");
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to submit contact enquiry:", err);
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <Navbar />

      <main className="grow">
        {/* Hero Section */}
        <section className="relative min-h-[460px] flex items-center justify-center text-center overflow-hidden py-16 px-4">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/contact-us/contactUs.png"
              alt="Contact Us Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-neutral-950/70" />
          </div>
          <div className="relative z-10 max-w-3xl flex flex-col items-center brand-reveal">
            <span className="text-xs uppercase font-bold tracking-wider text-[var(--brand-secondary)] mb-2 inline-block">
              Connect With Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Get in Touch
            </h1>
            <div className="mt-3 w-14 h-0.5 bg-[var(--brand-secondary)] rounded-full" />
            <p className="mt-6 text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl">
              Experience unparalleled service. Our dedicated advisory team in Mumbai is ready to
              assist you in discovering your next exclusive landmark property.
            </p>
          </div>
        </section>

        {/* Contact Info Cards + Form Grid */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Info Cards */}
            <div className="space-y-6 brand-reveal">
              {/* Our Office */}
              <div className="bg-white dark:bg-zinc-900 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-3">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--brand-primary)] dark:text-white">Our Office</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Level 42, The Platinum Tower
                  <br />
                  Bandra Kurla Complex (BKC)
                  <br />
                  Mumbai, Maharashtra 400051
                </p>
              </div>

              {/* Direct Line */}
              <div className="bg-white dark:bg-zinc-900 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-3">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--brand-primary)] dark:text-white">Direct Line</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  +91 22 6600 8899
                  <br />
                  <span className="text-xs text-neutral-500">Mon - Fri, 9:00 AM - 6:00 PM</span>
                </p>
              </div>

              {/* Email Inquiries */}
              <div className="bg-white dark:bg-zinc-900 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xs hover:shadow-md hover:border-[var(--brand-secondary)]/50 hover:-translate-y-1 transition-all duration-300">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)] border border-[var(--brand-secondary)]/20 shadow-xs mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--brand-primary)] dark:text-white">Email Inquiries</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed select-all">
                  concierge@propertyexpert.in
                  <br />
                  partners@propertyexpert.in
                </p>
              </div>
            </div>

            {/* Right Column: Message Form */}
            <div className="bg-white dark:bg-zinc-900 border border-neutral-150/70 dark:border-neutral-800 rounded-2xl p-8 shadow-xs">
              <h3 className="text-xl font-bold text-[var(--brand-primary)] dark:text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field */}
                <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
                  <label htmlFor="confirm_website_hp">Do Not Fill</label>
                  <input
                    id="confirm_website_hp"
                    type="text"
                    name="confirm_website_hp"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    autoComplete="new-password"
                    tabIndex={-1}
                  />
                </div>

                {/* Row 1: Full Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="John Doe"
                      disabled={isPending}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="focus-visible:ring-[var(--primary)] h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="john@example.com"
                      disabled={isPending}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="focus-visible:ring-[var(--primary)] h-11"
                    />
                  </div>
                </div>

                {/* Row 2: Phone + Property Interest */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      required
                      placeholder="+91 98765-43210"
                      disabled={isPending}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="focus-visible:ring-[var(--primary)] h-11"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Property Interest
                    </label>
                    <select
                      disabled={isPending}
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="flex h-11 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    >
                      <option value="">Select an option</option>
                      <option value="apartments">Apartments</option>
                      <option value="villas">Villas</option>
                      <option value="commercial">Commercial Spaces</option>
                      <option value="penthouses">Penthouses</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                    Your Message *
                  </label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="How can we assist you with your property search?"
                    disabled={isPending}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="focus-visible:ring-[var(--primary)]"
                  />
                </div>

                {/* Footer Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-400 leading-normal max-w-xs">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="primary-btn h-12 px-6 font-bold text-white shrink-0 min-w-[170px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Map Embed Section */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-150/70 dark:border-neutral-800/80 shadow-md h-96 md:h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.7981580226315!2d72.8617873!3d19.0725946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123f8d27b%3A0x6b44a491ad34964!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1719700000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Dark CTA Banner */}
        <section className="relative overflow-hidden bg-neutral-900 dark:bg-zinc-950 py-20 px-6 lg:px-8 border-y border-neutral-800/50 text-center flex flex-col items-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl max-w-2xl">
            Ready to Discover Your Next Exclusive Landmark Property?
          </h2>
          <div className="mt-4 w-14 h-0.5 bg-[var(--brand-secondary)] rounded-full mx-auto" />
          <div className="mt-8">
            <Button
              size="lg"
              asChild
              className="secondary-btn h-12 px-6 font-bold text-white! hover:text-primary! cursor-pointer"
            >
              <Link href="/projects">
                Schedule a Consultation
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
