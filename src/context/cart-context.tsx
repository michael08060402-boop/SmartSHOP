'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

interface FlyItem {
  id: string
  image: string
  x: number
  y: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  flyToCart: (image: string, sourceEl: Element) => void
  bounce: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

function FlyDot({ image, x, y, onDone }: { image: string; x: number; y: number; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cartBtn = document.querySelector('[data-cart-button]')
    const el = ref.current
    if (!cartBtn || !el) return

    const cartRect = cartBtn.getBoundingClientRect()
    const targetX = cartRect.left + cartRect.width / 2
    const targetY = cartRect.top + cartRect.height / 2

    const dx = targetX - x
    const dy = targetY - y

    // Keyframe animation via Web Animations API for a curved arc
    el.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
      { transform: `translate(${dx * 0.4}px, ${dy * 0.1 - 80}px) scale(1.15)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0, offset: 1 },
    ], {
      duration: 750,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
    })

    const t = setTimeout(onDone, 760)
    return () => clearTimeout(t)
  }, [x, y, onDone])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: x - 45,
        top: y - 45,
        width: 90,
        height: 90,
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 9999,
        pointerEvents: 'none',
        border: '2.5px solid #f97316',
        background: '#0a0f1e',
        boxShadow: '0 0 24px rgba(249,115,22,0.7), 0 0 48px rgba(249,115,22,0.3)',
      }}
    >
      {image
        ? <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
        : <div style={{ width: '100%', height: '100%', background: 'rgba(249,115,22,0.3)' }} />
      }
    </div>
  )
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [flyItems, setFlyItems] = useState<FlyItem[]>([])
  const [bounce, setBounce] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartshop-cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('smartshop-cart', JSON.stringify(items))
  }, [items])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === newItem.id)
      if (existing) {
        return prev.map(i =>
          i.id === newItem.id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
    // Bounce the cart icon when item lands (~750ms)
    setTimeout(() => {
      setBounce(true)
      setTimeout(() => setBounce(false), 500)
    }, 700)
  }, [])

  const flyToCart = useCallback((image: string, sourceEl: Element) => {
    const rect = sourceEl.getBoundingClientRect()
    const id = Math.random().toString(36).slice(2)
    setFlyItems(prev => [...prev, {
      id, image,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }])
  }, [])

  const removeFly = useCallback((id: string) => {
    setFlyItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  return (
    <CartContext.Provider value={{
      items, count, total, isOpen, bounce,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, removeItem, updateQuantity, clearCart, flyToCart,
    }}>
      {children}
      {mounted && flyItems.map(f => createPortal(
        <FlyDot key={f.id} image={f.image} x={f.x} y={f.y} onDone={() => removeFly(f.id)} />,
        document.body
      ))}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
