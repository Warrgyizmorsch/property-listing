"use client";

import React, { useState, useEffect, useRef } from "react";

export default function StickyNavigationTabs({ tabs = [] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const containerRef = useRef(null);
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Center active tab inside horizontal scrolling container (for mobile viewports)
  useEffect(() => {
    if (!activeTab || !containerRef.current) return;
    const container = containerRef.current;
    const activeBtn = container.querySelector(`[data-active="true"]`);
    if (activeBtn) {
      const containerWidth = container.offsetWidth;
      const btnOffsetLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      
      container.scrollTo({
        left: btnOffsetLeft - containerWidth / 2 + btnWidth / 2,
        behavior: "smooth"
      });
    }
  }, [activeTab]);

  // ScrollSpy Listener: Updates active tab state as user scrolls sections
  useEffect(() => {
    if (tabs.length === 0) return;

    const handleScroll = () => {
      // If we are currently handling a manual click scroll, bypass scroll spy updates
      if (isManualScrolling.current) return;

      // If user reaches near the bottom of the page, default active tab to the last element
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        setActiveTab(tabs[tabs.length - 1].id);
        return;
      }

      // Offset: height of sticky header + tabs container + buffer
      const scrollPosition = window.scrollY + 160;

      let currentActive = tabs[0].id;
      for (const tab of tabs) {
        const el = document.getElementById(tab.id);
        if (el) {
          // getBoundingClientRect().top + window.scrollY gives position relative to document top
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top - 20) {
            currentActive = tab.id;
          }
        }
      }
      setActiveTab(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Run initially to set active state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [tabs]);

  // Smooth scroll handler with correct sticky offsets
  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      isManualScrolling.current = true;
      setActiveTab(id);

      const offset = 145; // Height offset of sticky header + tabs container
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Clear any previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Re-enable scroll spy updates after smooth scroll finishes (approx 800ms)
      scrollTimeoutRef.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 800);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="sticky top-[79px] md:top-[85px] z-45 bg-white/95 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/60 dark:border-zinc-800 shadow-sm md:rounded-full rounded-2xl mb-8 p-1.5 overflow-x-auto scrollbar-none transition-all duration-300"
    >
      <div className="flex items-center justify-start md:justify-around gap-1.5 min-w-max mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(e) => handleClick(e, tab.id)}
              data-active={isActive ? "true" : "false"}
              className={`relative px-5 py-2.5 text-xs font-bold transition-all duration-300 rounded-full cursor-pointer whitespace-nowrap overflow-hidden select-none hover:scale-[1.02] active:scale-95 ${
                isActive
                  ? "bg-(--primary) text-white dark:bg-white dark:text-zinc-950 shadow-[0_4px_12px_rgba(11,31,58,0.12)] dark:shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                  : "text-neutral-500 hover:text-(--primary) hover:bg-neutral-100/60 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/40"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C8A45D] rounded-full animate-pulse z-20"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
