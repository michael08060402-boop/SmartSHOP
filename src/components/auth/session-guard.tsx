'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export function SessionGuard({ hasSession }: { hasSession: boolean }) {
  useEffect(() => {
    if (!hasSession) return
    const active = sessionStorage.getItem('ss_active')
    if (!active) {
      signOut({ callbackUrl: '/login' })
    }
  }, [hasSession])

  return null
}
