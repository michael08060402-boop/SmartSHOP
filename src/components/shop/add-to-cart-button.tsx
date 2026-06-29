'use client'

import { useState, useRef } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/context/toast-context'

interface Props {
  product: { id: string; name: string; price: number; image: string; stock: number }
  label?: string
}

export function AddToCartButton({ product, label = 'Agregar al carrito' }: Props) {
  const { addItem, flyToCart } = useCart()
  const { addToast } = useToast()
  const [added, setAdded] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleAdd() {
    if (btnRef.current) flyToCart(product.image, btnRef.current)
    addItem(product)
    addToast({ type: 'cart', title: 'Agregado al carrito', subtitle: product.name })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      ref={btnRef}
      disabled={product.stock === 0}
      onClick={handleAdd}
      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: added
          ? 'linear-gradient(90deg, #059669, #34d399)'
          : 'linear-gradient(90deg, #ea580c, #f97316)',
        color: '#fff',
        boxShadow: added
          ? '0 4px 24px rgba(52,211,153,0.35)'
          : '0 4px 24px rgba(249,115,22,0.35)',
      }}
    >
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {added ? '¡Agregado!' : label}
    </button>
  )
}
