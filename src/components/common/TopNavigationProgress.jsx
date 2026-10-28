"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * TopNavigationProgress creates an immediate luxury gold loading bar across the top of the viewport
 * when internal navigation links are clicked, giving the user instant feedback with zero perceived lag.
 */
export default function TopNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams changes, navigation has completed.
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let progressInterval = null;

    if (loading) {
      setProgress(25);
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15;
        });
      }, 150);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading]);

  useEffect(() => {
    const handleClick = (e) => {
      // Find closest anchor tag
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Ignore external, anchor links, same path, download, or new tabs
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        href.startsWith("javascript:") ||
        target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if navigating to a different internal URL
      try {
        const nextUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          nextUrl.origin === currentUrl.origin &&
          (nextUrl.pathname !== currentUrl.pathname || nextUrl.search !== currentUrl.search)
        ) {
          setLoading(true);
          setProgress(20);
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#C8A45D] via-[#DFBA73] to-[#C8A45D] shadow-[0_0_10px_rgba(200,164,93,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
