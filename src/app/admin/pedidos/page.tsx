import { db } from '@/lib/db'
import { StatusSelect } from './status-select'
import { ShoppingBag, User, MapPin, Phone, Package } from 'lucide-react'

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  CONFIRMED: { label: 'Confirmado', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  SHIPPED:   { label: 'En camino',  color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  DELIVERED: { label: 'Entregado',  color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  CANCELLED: { label: 'Cancelado',  color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

const payLabel: Record<string, string> = {
  card: 'Tarjeta', yape: 'Yape', plin: 'Plin', cash: 'Contra entrega',
}

export default async function AdminPedidosPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user:  { select: { name: true, email: true } },
      items: true,
    },
  })

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(statusMap).map(([k, v]) => {
            const count = orders.filter(o => o.status === k).length
            return count > 0 ? (
              <span key={k} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ color: v.color, background: v.bg, border: `1px solid ${v.color}30` }}>
                {v.label}: {count}
              </span>
            ) : null
          })}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <ShoppingBag size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No hay pedidos aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s = statusMap[order.status]
            return (
              <div
                key={order.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
                      <ShoppingBag size={14} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(order.createdAt).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {payLabel[order.payMethod] ?? order.payMethod}
                    </span>
                    <p className="text-base font-bold" style={{ color: '#f97316' }}>
                      S/. {order.total.toLocaleString('es-PE')}
                    </p>
                    <StatusSelect orderId={order.id} current={order.status} />
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Customer */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Cliente</p>
                    <div className="flex items-center gap-2">
                      <User size={13} style={{ color: '#3b82f6' }} />
                      <p className="text-sm text-white">{order.user.name ?? '—'}</p>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.user.email}</p>
                    <div className="flex items-center gap-2">
                      <Phone size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{order.phone}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{order.address}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Productos ({order.items.length})
                    </p>
                    <div className="space-y-1.5">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.06)' }}>
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />
                              : <Package size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                          </div>
                          <p className="text-xs text-white flex-1 truncate">{item.name}</p>
                          <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>×{item.quantity}</span>
                          <span className="text-xs font-semibold shrink-0" style={{ color: '#f97316' }}>
                            S/. {(item.price * item.quantity).toLocaleString('es-PE')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
