'use client'

import { useTransition } from 'react'
import { updateOrderStatus } from './actions'
import { OrderStatus } from '@prisma/client'

const options: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'PENDING',   label: 'Pendiente',  color: '#f59e0b' },
  { value: 'CONFIRMED', label: 'Confirmado', color: '#3b82f6' },
  { value: 'SHIPPED',   label: 'En camino',  color: '#a855f7' },
  { value: 'DELIVERED', label: 'Entregado',  color: '#34d399' },
  { value: 'CANCELLED', label: 'Cancelado',  color: '#f87171' },
]

export function StatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [pending, startTransition] = useTransition()
  const cur = options.find(o => o.value === current)

  return (
    <select
      value={current}
      disabled={pending}
      onChange={e => startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))}
      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-opacity disabled:opacity-50"
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderColor: `${cur?.color ?? '#fff'}40`,
        color: cur?.color ?? '#fff',
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#0a0f1e', color: o.color }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
