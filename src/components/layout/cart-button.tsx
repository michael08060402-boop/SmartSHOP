'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useState } from 'react'

export function CartButton() {
  const { count, openCart, bounce } = useCart()
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    setClicked(true)
    openCart()
  }

  return (
    <button
      data-cart-button
      onClick={handleClick}
      className="relative flex flex-col items-center gap-0.5 hover:opacity-70"
      style={{ color: 'rgba(255,255,255,0.55)' }}
    >
      <style>{`
        @keyframes cartBounce {
          0%  { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.4) rotate(-12deg); }
          50% { transform: scale(1.3) rotate(10deg); }
          75% { transform: scale(1.15) rotate(-5deg); }
          100%{ transform: scale(1) rotate(0deg); }
        }
        @keyframes cartPop {
          0%   { transform: scale(1) rotate(0deg); }
          40%  { transform: scale(0.8) rotate(-8deg); }
          70%  { transform: scale(1.2) rotate(6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
      <div
        className="relative"
        style={{
          animation: bounce
            ? 'cartBounce 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards'
            : clicked
            ? 'cartPop 0.35s ease forwards'
            : 'none',
        }}
        onAnimationEnd={() => setClicked(false)}
      >
        <ShoppingCart size={20} />
        {count > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center"
            style={{ background: '#f97316', color: '#fff' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span className="text-[9px] font-medium">Carrito</span>
    </button>
  )
}
