'use client'

import { useCompare } from '@/context/compare-context'
import { Scale, X, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CompareBar() {
  const { items, clear, toggle } = useCompare()
  const router = useRouter()

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className="m-4 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl pointer-events-auto"
        style={{
          background: 'rgba(10,15,28,0.96)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(59,130,246,0.3)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)',
          maxWidth: 600,
          width: 'calc(100% - 2rem)',
        }}
      >
        <Scale size={15} style={{ color: '#3b82f6', flexShrink: 0 }} />

        <span className="text-sm font-medium text-white flex-1">
          Comparando{' '}
          <span style={{ color: '#f97316', fontWeight: 700 }}>{items.length}</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>/3</span>
        </span>

        {/* Thumbnails */}
        <div className="flex items-center gap-1">
          {items.map(p => (
            <div key={p.id} className="relative">
              <div
                className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                  : <span className="text-sm">📦</span>}
              </div>
              <button
                onClick={() => toggle(p)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors hover:bg-red-500"
                style={{ background: '#374151' }}
              >
                <X size={8} style={{ color: '#fff' }} />
              </button>
            </div>
          ))}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div
              key={i}
              className="hidden md:flex w-8 h-8 rounded-xl border-dashed items-center justify-center"
              style={{ border: '1px dashed rgba(255,255,255,0.15)' }}
            >
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
            </div>
          ))}
        </div>

        {items.length >= 2 && (
          <button
            onClick={() => router.push(`/comparar?ids=${items.map(p => p.id).join(',')}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', color: '#fff' }}
          >
            Comparar <ArrowRight size={12} />
          </button>
        )}

        <button
          onClick={clear}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </button>
      </div>
    </div>
  )
}
