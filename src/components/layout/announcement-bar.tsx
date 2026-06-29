import { Truck, Zap } from 'lucide-react'
import { getSetting } from '@/lib/settings'

export async function AnnouncementBar() {
  const text = await getSetting('announcement')
  const parts = text.split('|').map((s: string) => s.trim())
  const part0 = parts[0] ?? ''
  const part1 = parts[1] ?? ''

  return (
    <div
      className="w-full py-2.5 px-4 text-center text-sm font-medium flex items-center justify-center gap-2"
      style={{
        background: 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 35%, #ea580c 65%, #f97316 100%)',
        color: '#fff',
      }}
    >
      <Truck size={15} className="shrink-0" />
      <span>{part0}</span>
      {part1 && (
        <>
          <span className="hidden sm:inline mx-3 opacity-50">|</span>
          <span className="hidden sm:inline flex items-center gap-1">
            <Zap size={13} className="inline mr-1" />
            {part1}
          </span>
        </>
      )}
    </div>
  )
}
