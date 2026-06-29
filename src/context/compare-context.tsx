'use client'

import { createContext, useContext, useState } from 'react'

export interface CompareProduct {
  id: string
  name: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  badge: string | null
}

interface CompareCtx {
  items: CompareProduct[]
  toggle: (p: CompareProduct) => void
  isIn: (id: string) => boolean
  clear: () => void
}

const Ctx = createContext<CompareCtx>({
  items: [],
  toggle: () => {},
  isIn: () => false,
  clear: () => {},
})

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareProduct[]>([])

  const toggle = (p: CompareProduct) =>
    setItems(prev =>
      prev.some(x => x.id === p.id)
        ? prev.filter(x => x.id !== p.id)
        : prev.length >= 3 ? prev : [...prev, p]
    )

  const isIn = (id: string) => items.some(x => x.id === id)
  const clear = () => setItems([])

  return <Ctx.Provider value={{ items, toggle, isIn, clear }}>{children}</Ctx.Provider>
}

export const useCompare = () => useContext(Ctx)
