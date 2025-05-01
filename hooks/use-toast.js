"use client"

import { useState, createContext, useContext } from "react"

const TOAST_REMOVE_DELAY = 1000

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, action, ...props }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = {
      id,
      title,
      description,
      action,
      ...props,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])
    return id
  }

  const dismiss = (toastId) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  return <ToastContext.Provider value={{ toast, dismiss, toasts }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: context.toast,
    dismiss: context.dismiss,
    toasts: context.toasts,
  }
}
