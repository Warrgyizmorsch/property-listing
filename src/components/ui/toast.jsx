"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

const ToastContext = createContext(null)

let toastListener = null

export const toast = {
  success: (message) => {
    if (toastListener) toastListener(message, "success")
  },
  error: (message) => {
    if (toastListener) toastListener(message, "error")
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastListener = (message, type) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, message, type }])
    }
    return () => {
      toastListener = null
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-bottom-2 ${
        toast.type === "success"
          ? "border-green-100 bg-white text-neutral-800"
          : "border-red-100 bg-white text-neutral-800"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {toast.type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5 rounded-md hover:bg-neutral-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
