'use client'

import { createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'cart' | 'fav' | 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  subtitle?: string
}

interface ToastCtx {
  toasts: Toast[]
  addToast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const Ctx = createContext<ToastCtx>({ toasts: [], addToast: () => {}, removeToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-2), { ...t, id }])
    setTimeout(() => removeToast(id), 3000)
  }, [removeToast])

  return (
    <Ctx.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
