'use client'

import { useEffect } from 'react'
import { useRecentlyViewed, type ViewedProduct } from '@/context/recently-viewed-context'

export function TrackRecentlyViewed({ product }: { product: ViewedProduct }) {
  const { addViewed } = useRecentlyViewed()
  useEffect(() => { addViewed(product) }, [product.id])
  return null
}
