'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/favorites-context'
import { useState } from 'react'

export function FavoritesButton() {
  const { count, openFavorites } = useFavorites()
  const [anim, setAnim] = useState(false)

  function handleClick() {
    setAnim(true)
    openFavorites()
  }

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-col items-center gap-0.5 hover:opacity-70"
      style={{ color: 'rgba(255,255,255,0.55)' }}
    >
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.75); }
          60%  { transform: scale(1.35); }
          80%  { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
      `}</style>
      <div
        className="relative"
        style={{ animation: anim ? 'heartPop 0.4s ease forwards' : 'none' }}
        onAnimationEnd={() => setAnim(false)}
      >
        <Heart size={20} fill={count > 0 ? '#f97316' : 'none'} style={{ color: count > 0 ? '#f97316' : 'rgba(255,255,255,0.55)' }} />
        {count > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center"
            style={{ background: '#f97316', color: '#fff' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span className="text-[9px] font-medium">Favoritos</span>
    </button>
  )
}
