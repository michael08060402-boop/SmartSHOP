'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface ViewedProduct {
  id: string
  name: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  badge: string | null
}

interface RecentlyViewedCtx {
  items: ViewedProduct[]
  addViewed: (product: ViewedProduct) => void
}

const Ctx = createContext<RecentlyViewedCtx>({ items: [], addViewed: () => {} })

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ViewedProduct[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rv')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  function addViewed(p: ViewedProduct) {
    setItems(prev => {
      const next = [p, ...prev.filter(x => x.id !== p.id)].slice(0, 10)
      try { localStorage.setItem('rv', JSON.stringify(next)) } catch {}
      return next
    })
  }

  return <Ctx.Provider value={{ items, addViewed }}>{children}</Ctx.Provider>
}

export const useRecentlyViewed = () => useContext(Ctx)
