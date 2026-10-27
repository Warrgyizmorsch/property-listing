import Link from "next/link";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-24 px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#C8A45D] mx-auto text-3xl font-extrabold font-heading">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading">
              Page Not Found
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              The requested property, project, or page could not be found or has been moved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild className="primary-btn text-xs font-bold h-10 px-5">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
            <Button asChild className="secondary-btn text-xs font-bold h-10 px-5">
              <Link href="/projects" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Explore Projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
