'use client'

import { useFavorites } from '@/context/favorites-context'
import { useCart } from '@/context/cart-context'
import { X, Heart, ShoppingCart, Trash2, ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function FavoritesDrawer() {
  const { items, isOpen, closeFavorites, remove } = useFavorites()
  const { addItem, flyToCart } = useCart()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (isOpen) { setClosing(false); setVisible(true) }
    else if (visible) {
      setClosing(true)
      const t = setTimeout(() => { setVisible(false); setClosing(false) }, 280)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!visible) return null

  const discount = (price: number, original?: number | null) =>
    original ? Math.round((1 - price / original) * 100) : null

  return (
    <>
      <style>{`
        @keyframes drawerIn  { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes drawerOut { from { transform: translateX(0) } to { transform: translateX(100%) } }
        @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          animation: `${closing ? 'backdropOut' : 'backdropIn'} 0.28s ease forwards`,
        }}
        onClick={closeFavorites}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(420px, 100vw)',
          background: 'linear-gradient(180deg, #080c18 0%, #07080f 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
          animation: `${closing ? 'drawerOut' : 'drawerIn'} 0.28s cubic-bezier(0.32,0.72,0,1) forwards`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2">
            <Heart size={18} fill="#f97316" style={{ color: '#f97316' }} />
            <h2 className="font-bold text-white text-base">Favoritos</h2>
            {items.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
                {items.length}
              </span>
            )}
          </div>
          <button onClick={closeFavorites}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <Heart size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
                No tienes favoritos aún
              </p>
              <button onClick={closeFavorites}
                className="text-xs px-4 py-2 rounded-xl font-medium transition-colors"
                style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
                Explorar productos
              </button>
            </div>
          ) : (
            items.map(item => {
              const disc = discount(item.price, item.originalPrice)
              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>

                  {/* Image */}
                  <Link href={`/producto/${item.id}`} onClick={closeFavorites}
                    className="w-16 h-16 rounded-xl shrink-0 overflow-hidden flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {item.image && !imgErrors[item.id] ? (
                      <img src={item.image} alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))} />
                    ) : (
                      <ImageIcon size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/producto/${item.id}`} onClick={closeFavorites}>
                      <p className="text-sm font-semibold text-white leading-tight line-clamp-2 hover:text-blue-400 transition-colors">
                        {item.name}
                      </p>
                    </Link>
                    <span className="text-[10px]" style={{ color: '#60a5fa' }}>{item.category}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-white">S/. {item.price.toLocaleString('es-PE')}</span>
                      {disc && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                          -{disc}%
                        </span>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={e => {
                        flyToCart(item.image, e.currentTarget)
                        addItem({ id: item.id, name: item.name, price: item.price, image: item.image, stock: 99 })
                      }}
                      className="mt-2 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                      style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}
                    >
                      <ShoppingCart size={11} /> Agregar al carrito
                    </button>
                  </div>

                  {/* Remove */}
                  <button onClick={() => remove(item.id)}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                    style={{ color: 'rgba(239,68,68,0.5)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
