'use server'

import { db } from '@/lib/db'

export async function getSearchSuggestions(query: string) {
  const q = query.trim()
  if (q.length < 2) return []

  return db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name:     { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { badge:    { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, name: true, price: true, images: true, category: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })
}
