'use client'

import { useState, useTransition } from 'react'
import { Star, Send, Loader2, Check } from 'lucide-react'
import { createReview } from '@/app/(shop)/producto/[id]/actions'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
  user: { name: string | null; image: string | null }
}

interface Props {
  productId: string
  reviews: Review[]
  canReview: boolean
  avgRating: number
}

export function ProductReviews({ productId, reviews, canReview, avgRating }: Props) {
  const [selected, setSelected] = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('rating', String(selected))
    setMsg(null)
    startTransition(async () => {
      const res = await createReview(productId, fd)
      if (res.success) {
        setMsg({ type: 'ok', text: '¡Gracias por tu reseña!' })
        setSelected(0)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMsg({ type: 'err', text: res.error! })
      }
    })
  }

  const starColor = (pos: number, val: number) => pos <= val ? '#f97316' : 'rgba(255,255,255,0.15)'

  return (
    <div className="mt-10 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Reseñas</h2>
        <div className="h-px mt-1.5 w-24" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
      </div>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">{avgRating.toFixed(1)}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} fill={starColor(s, Math.round(avgRating))} style={{ color: starColor(s, Math.round(avgRating)) }} />
              ))}
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
          {/* Bar chart */}
          <div className="flex-1 space-y-1.5">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length
              const pct   = reviews.length ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] w-2 text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>{star}</span>
                  <Star size={9} fill="#f97316" style={{ color: '#f97316' }} />
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ea580c, #f97316)' }} />
                  </div>
                  <span className="text-[10px] w-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Write review */}
      {canReview && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-semibold text-white">Deja tu reseña</h3>

          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button"
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setSelected(s)}
                className="transition-transform hover:scale-110">
                <Star size={28}
                  fill={starColor(s, hovered || selected)}
                  style={{ color: starColor(s, hovered || selected), transition: 'fill 0.1s' }} />
              </button>
            ))}
            {selected > 0 && (
              <span className="ml-2 text-sm" style={{ color: '#f97316' }}>
                {['','Malo','Regular','Bueno','Muy bueno','Excelente'][selected]}
              </span>
            )}
          </div>

          <textarea name="comment" rows={3} placeholder="Comparte tu experiencia con este producto (opcional)"
            className="w-full rounded-xl text-sm outline-none resize-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: '12px 14px',
            }}
            onFocus={e => { e.target.style.borderColor = '#f97316' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }} />

          {msg && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl"
              style={{
                background: msg.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                color: msg.type === 'ok' ? '#34d399' : '#f87171',
                border: `1px solid ${msg.type === 'ok' ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
              {msg.type === 'ok' ? <Check size={14} /> : null} {msg.text}
            </div>
          )}

          <button type="submit" disabled={isPending || selected === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}>
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Publicar reseña
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Sé el primero en dejar una reseña
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-2xl space-y-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #f97316)', color: '#fff' }}>
                    {r.user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.user.name ?? 'Usuario'}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {new Date(r.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} fill={starColor(s, r.rating)} style={{ color: starColor(s, r.rating) }} />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
