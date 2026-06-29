'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface FavoriteItem {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  category: string
  badge?: string | null
}

interface FavoritesContextValue {
  items: FavoriteItem[]
  count: number
  isOpen: boolean
  openFavorites: () => void
  closeFavorites: () => void
  toggle: (item: FavoriteItem) => void
  isFavorite: (id: string) => boolean
  remove: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('smartshop-favorites')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('smartshop-favorites', JSON.stringify(items))
  }, [items])

  const toggle = useCallback((item: FavoriteItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev.filter(i => i.id !== item.id)
      return [...prev, item]
    })
  }, [])

  const isFavorite = useCallback((id: string) => items.some(i => i.id === id), [items])

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return (
    <FavoritesContext.Provider value={{
      items,
      count: items.length,
      isOpen,
      openFavorites: () => setIsOpen(true),
      closeFavorites: () => setIsOpen(false),
      toggle, isFavorite, remove,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
