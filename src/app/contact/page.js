import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import CTASection from "@/components/home/CTASection";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/30 dark:bg-zinc-950 font-sans">
      <Navbar />
      <main className="grow">
        <div className="h-20 md:h-28"></div>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
