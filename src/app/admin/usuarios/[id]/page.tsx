import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Package, MapPin, Phone, Calendar, Shield, User, Mail } from 'lucide-react'

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

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await db.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      },
    },
  })

  if (!user) notFound()

  const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0)
  const initials = (user.name ?? user.email ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="p-6 space-y-6" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Back */}
      <Link href="/admin/usuarios" className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        <ArrowLeft size={14} /> Volver a usuarios
      </Link>

      {/* User card */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Top row: avatar + name + (stats on desktop) */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center text-lg font-bold"
            style={{
              background: isAdmin ? 'linear-gradient(135deg,rgba(249,115,22,0.3),rgba(59,130,246,0.3))' : 'rgba(255,255,255,0.07)',
              border: isAdmin ? '1px solid rgba(249,115,22,0.4)' : '1px solid rgba(255,255,255,0.1)',
              color: isAdmin ? '#f97316' : 'rgba(255,255,255,0.5)',
            }}>
            {user.image ? <img src={user.image} alt={initials} className="w-full h-full object-cover" /> : initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{user.name ?? '—'}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={isAdmin
                  ? { color: '#f97316', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }
                  : { color: '#3b82f6', background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.2)' }}>
                {isAdmin ? <Shield size={9} /> : <User size={9} />}
                {isAdmin ? 'Admin' : 'Usuario'}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Mail size={11} /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <Phone size={11} /> {user.phone}
                </span>
              )}
              {user.address && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <MapPin size={11} /> {user.address}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Calendar size={11} /> Registrado el {new Date(user.createdAt).toLocaleDateString('es-PE', { dateStyle: 'long' })}
              </span>
            </div>
          </div>

          {/* Stats — desktop only */}
          <div className="hidden md:flex gap-3 shrink-0">
            <div className="text-center px-4 py-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-2xl font-bold text-white">{user.orders.length}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Pedidos</p>
            </div>
            <div className="text-center px-4 py-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
              <p className="text-xl font-bold" style={{ color: '#f97316' }}>S/. {totalSpent.toLocaleString('es-PE')}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Total gastado</p>
            </div>
          </div>
        </div>

        {/* Stats — mobile only */}
        <div className="flex md:hidden gap-3 mt-4">
          <div className="flex-1 text-center px-3 py-2.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <p className="text-xl font-bold text-white">{user.orders.length}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Pedidos</p>
          </div>
          <div className="flex-1 text-center px-3 py-2.5 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p className="text-xl font-bold" style={{ color: '#f97316' }}>S/. {totalSpent.toLocaleString('es-PE')}</p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Total gastado</p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Historial de pedidos</h2>

        {user.orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <ShoppingBag size={36} style={{ color: 'rgba(255,255,255,0.1)' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Este usuario no tiene pedidos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.orders.map(order => {
              const s = statusMap[order.status]
              return (
                <div key={order.id} className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(order.createdAt).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                        {payLabel[order.payMethod] ?? order.payMethod}
                      </span>
                      <span className="text-sm font-bold" style={{ color: '#f97316' }}>
                        S/. {order.total.toLocaleString('es-PE')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color: s.color, background: s.bg }}>
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-3 space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />
                            : <Package size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />}
                        </div>
                        <p className="text-xs text-white flex-1 truncate">{item.name}</p>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>×{item.quantity}</span>
                        <span className="text-xs font-semibold" style={{ color: '#f97316' }}>
                          S/. {(item.price * item.quantity).toLocaleString('es-PE')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
