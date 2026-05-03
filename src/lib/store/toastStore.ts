'use client'

import { create } from 'zustand'
import { generateId } from '@/lib/utils/generateId'
import type { Toast, ToastType } from '@/lib/types'

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void

  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

// Tracks auto-dismiss timers so they can be cancelled on manual dismiss
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId('toast')
    const newToast: Toast = { ...toast, id }

    set((state) => ({
      toasts: [...state.toasts, newToast].slice(-5),
    }))

    const duration = toast.duration ?? 3000
    if (duration > 0) {
      const timer = setTimeout(() => {
        timers.delete(id)
        get().removeToast(id)
      }, duration)
      timers.set(id, timer)
    }

    return id
  },

  removeToast: (id) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  clearToasts: () => {
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
    set({ toasts: [] })
  },

  success: (title, message) => {
    get().addToast({ type: 'success', title, message })
  },

  error: (title, message) => {
    get().addToast({ type: 'error', title, message, duration: 5000 })
  },

  warning: (title, message) => {
    get().addToast({ type: 'warning', title, message })
  },

  info: (title, message) => {
    get().addToast({ type: 'info', title, message })
  },
}))
