'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCompletePage() {
  const router = useRouter()

  useEffect(() => {
    sessionStorage.setItem('ss_active', '1')
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#06060f' }}>
      <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  )
}
