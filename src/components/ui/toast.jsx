"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

let toastListener = null;

export const toast = {
  success: (message) => {
    if (toastListener) toastListener(message, "success");
  },
  error: (message) => {
    if (toastListener) toastListener(message, "error");
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListener = (message, type) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    // Wait for exit animation then remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, removeToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[99999] flex flex-col gap-2.5 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const TOAST_DURATION = 4000;

function ToastItem({ toast, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on next frame
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const isSuccess = toast.type === "success";

  return (
    <div
      style={{
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: toast.exiting ? 0 : mounted ? 1 : 0,
        transform: toast.exiting
          ? "translateX(120%)"
          : mounted
            ? "translateX(0)"
            : "translateX(120%)",
      }}
      className={`relative overflow-hidden flex items-start justify-between gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-sm ${
        isSuccess
          ? "border-green-200/80 bg-white/95 text-neutral-800"
          : "border-red-200/80 bg-white/95 text-neutral-800"
      }`}
    >
      {/* Accent strip */}
      <div
        className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${
          isSuccess ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="flex items-start gap-2.5 pl-2">
        {isSuccess ? (
          <div className="p-1 rounded-full bg-green-50 shrink-0 mt-0.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
        ) : (
          <div className="p-1 rounded-full bg-red-50 shrink-0 mt-0.5">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
        )}
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {isSuccess ? "Success" : "Error"}
          </p>
          <p className="text-sm font-medium leading-relaxed mt-0.5">
            {toast.message}
          </p>
        </div>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-lg hover:bg-neutral-100 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-neutral-100">
        <div
          className={`h-full rounded-full ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
          style={{
            animation: `toast-progress ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
