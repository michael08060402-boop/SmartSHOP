'use client'

import { useToast, type Toast } from '@/context/toast-context'
import { ShoppingCart, Heart, Check, X, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

const config = {
  cart:    { icon: ShoppingCart, color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  fav:     { icon: Heart,        color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  success: { icon: Check,        color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)' },
  error:   { icon: X,            color: '#f87171', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)'  },
  info:    { icon: Info,         color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)' },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [visible, setVisible] = useState(false)
  const { icon: Icon, color, bg, border } = config[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => setVisible(false), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      onClick={onRemove}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer select-none"
      style={{
        background: 'rgba(10,15,28,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${border}`,
        minWidth: 260,
        maxWidth: 340,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{toast.title}</p>
        {toast.subtitle && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{toast.subtitle}</p>
        )}
      </div>
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-full"
        style={{
          background: color,
          width: visible ? '0%' : '100%',
          transition: visible ? 'width 2.6s linear' : 'none',
          marginLeft: 0,
        }}
      />
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: 340 }}
    >
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto relative overflow-hidden rounded-2xl">
          <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  )
}
