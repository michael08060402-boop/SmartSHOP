'use client'

import { Heart } from 'lucide-react'
import { useFavorites, type FavoriteItem } from '@/context/favorites-context'
import { useToast } from '@/context/toast-context'

export function FavoriteToggleButton({ item }: { item: FavoriteItem }) {
  const { toggle, isFavorite } = useFavorites()
  const { addToast } = useToast()
  const fav = isFavorite(item.id)

  function handleToggle() {
    toggle(item)
    addToast({
      type: 'fav',
      title: fav ? 'Eliminado de favoritos' : 'Añadido a favoritos',
      subtitle: item.name,
    })
  }

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
      style={{
        background: fav ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${fav ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: fav ? '#f97316' : 'rgba(255,255,255,0.5)',
      }}
    >
      <Heart size={18} fill={fav ? '#f97316' : 'none'} style={{ color: fav ? '#f97316' : 'rgba(255,255,255,0.5)' }} />
      {fav ? 'En favoritos' : 'Favoritos'}
    </button>
  )
}
