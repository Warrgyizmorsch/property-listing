import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialSection from "@/components/home/TestimonialSection";
import StatisticsSection from "@/components/home/StatisticsSection";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/30 dark:bg-zinc-950 font-sans">
      <Navbar />
      <main className="grow">
        <WhyChooseUs />
        <StatisticsSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}
