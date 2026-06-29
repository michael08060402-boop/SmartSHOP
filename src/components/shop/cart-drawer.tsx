'use client'

import { useCart } from '@/context/cart-context'
import { X, Trash2, Plus, Minus, ShoppingBag, ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count, clearCart } = useCart()
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
        onClick={closeCart}
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
            <ShoppingBag size={18} style={{ color: '#f97316' }} />
            <h2 className="font-bold text-white text-base">Mi carrito</h2>
            {count > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20"
              style={{ color: 'rgba(255,255,255,0.2)' }}>
              <ShoppingBag size={48} />
              <p className="text-sm font-medium">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Image */}
                <div className="w-16 h-16 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {item.image && !imgErrors[item.id] ? (
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-contain p-1"
                      onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))} />
                  ) : (
                    <ImageIcon size={20} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{item.name}</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#f97316' }}>
                    S/. {(item.price * item.quantity).toLocaleString('es-PE')}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                      <Minus size={11} />
                    </button>
                    <span className="text-sm font-semibold text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30"
                      style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button onClick={() => removeItem(item.id)}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                  style={{ color: 'rgba(239,68,68,0.5)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t space-y-3"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</span>
              <span className="text-lg font-bold text-white">S/. {total.toLocaleString('es-PE')}</span>
            </div>
            <a href="/checkout"
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 flex items-center justify-center"
              style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
              Proceder al pago
            </a>
            <button onClick={clearCart}
              className="w-full py-2 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  )
}
