"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export default function StickyNavigationTabs({ tabs = [] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");
  const containerRef = useRef(null);
  const tabsWrapperRef = useRef(null);
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Sliding capsule indicator state
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Measure and position the sliding capsule on the active button
  const updateIndicator = useCallback(() => {
    if (!tabsWrapperRef.current) return;
    const activeBtn = tabsWrapperRef.current.querySelector(`[data-active="true"]`);
    if (activeBtn) {
      const wrapperRect = tabsWrapperRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - wrapperRect.left,
        width: btnRect.width,
      });
    }
  }, []);

  // Update indicator whenever activeTab changes
  useEffect(() => {
    // Small delay to let DOM update data-active attributes
    requestAnimationFrame(updateIndicator);
  }, [activeTab, updateIndicator]);

  // Also update on window resize
  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

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
      className="sticky top-[79px] md:top-[85px] z-45 bg-slate-100/90 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/60 dark:border-zinc-800 shadow-sm md:rounded-full rounded-2xl mb-8 overflow-x-auto scrollbar-none transition-all duration-300"
    >
      <div
        ref={tabsWrapperRef}
        className="relative flex items-center w-full p-1"
      >
        {/* Sliding capsule indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-full bg-[var(--primary)] dark:bg-white shadow-[0_4px_14px_rgba(11,31,58,0.15)] dark:shadow-[0_0_14px_rgba(255,255,255,0.15)] z-0"
          style={{
            left: indicator.left,
            width: indicator.width,
            transition: "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(e) => handleClick(e, tab.id)}
              data-active={isActive ? "true" : "false"}
              className={`relative z-10 flex-1 py-3 text-xs font-bold transition-colors duration-300 rounded-full cursor-pointer whitespace-nowrap select-none text-center ${
                isActive
                  ? "text-white dark:text-zinc-950"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#C8A45D] rounded-full animate-pulse z-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
