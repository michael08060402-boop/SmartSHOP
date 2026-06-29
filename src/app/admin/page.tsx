import { db } from '@/lib/db'
import { Users, Package, ShoppingBag, TrendingUp, ArrowUpRight, Clock } from 'lucide-react'

async function getStats() {
  const users         = await db.user.count()
  const products      = await db.product.count({ where: { isActive: true } })
  const orders        = await db.order.count()
  const revenueAgg    = await db.order.aggregate({ _sum: { total: true } })
  const latestOrders  = await db.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } } } })
  const latestProducts = await db.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, where: { isActive: true } })
  return { users, products, orders, revenue: revenueAgg._sum.total ?? 0, latestOrders, latestProducts }
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  CONFIRMED: { label: 'Confirmado', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  SHIPPED:   { label: 'En camino',  color: '#a855f7', bg: 'rgba(168,85,247,0.12)'  },
  DELIVERED: { label: 'Entregado',  color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  CANCELLED: { label: 'Cancelado',  color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

function StatusChip({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, color: '#fff', bg: 'rgba(255,255,255,0.1)' }
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  )
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    { label: 'Usuarios registrados', value: stats.users,    icon: Users,       color: '#3b82f6', glow: 'rgba(59,130,246,0.2)',  bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)' },
    { label: 'Productos activos',    value: stats.products, icon: Package,     color: '#f97316', glow: 'rgba(249,115,22,0.2)',   bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)' },
    { label: 'Pedidos totales',      value: stats.orders,   icon: ShoppingBag, color: '#3b82f6', glow: 'rgba(59,130,246,0.2)',  bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)' },
    { label: 'Ingresos totales',     value: `S/. ${stats.revenue.toLocaleString('es-PE')}`, icon: TrendingUp, color: '#f97316', glow: 'rgba(249,115,22,0.2)', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
  ]

  return (
    <div className="p-6 space-y-8" style={{ background: '#111214', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Resumen general de SmartSHOP
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.35)', color: '#f97316' }}>
          Panel de Administrador
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, glow, border }) => (
          <div key={label} className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${border}`,
              boxShadow: `0 8px 32px ${glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: color }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: `1px solid ${color}40` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <ArrowUpRight size={14} style={{ color: `${color}80` }} />
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Acciones rapidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Agregar producto', href: '/admin/productos/nuevo', color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.08)' },
            { label: 'Ver usuarios',     href: '/admin/usuarios',        color: '#3b82f6', border: 'rgba(59,130,246,0.3)',  bg: 'rgba(59,130,246,0.08)' },
            { label: 'Ver pedidos',      href: '/admin/pedidos',         color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.08)' },
            { label: 'Configuracion',    href: '/admin/config',          color: '#3b82f6', border: 'rgba(59,130,246,0.3)',  bg: 'rgba(59,130,246,0.08)' },
          ].map(({ label, href, color, border }) => (
            <a key={label} href={href}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${border}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                color,
              }}>
              {label}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </div>

      {/* Latest orders + products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Latest orders */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Ultimos pedidos</h2>
            <a href="/admin/pedidos" className="text-xs font-medium" style={{ color: '#3b82f6' }}>Ver todos</a>
          </div>
          {stats.latestOrders.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin pedidos aun</p>
          ) : (
            <div className="space-y-2.5">
              {stats.latestOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div>
                    <p className="text-xs font-semibold text-white">{o.user.name ?? o.user.email}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      <Clock size={8} className="inline mr-1" />
                      {new Date(o.createdAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: '#f97316' }}>S/. {o.total.toLocaleString('es-PE')}</p>
                    <StatusChip status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest products */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Productos recientes</h2>
            <a href="/admin/productos" className="text-xs font-medium" style={{ color: '#f97316' }}>Ver todos</a>
          </div>
          {stats.latestProducts.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'rgba(255,255,255,0.2)' }}>Sin productos aun</p>
          ) : (
            <div className="space-y-2.5">
              {stats.latestProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-9 h-9 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.category}</p>
                  </div>
                  <p className="text-xs font-bold shrink-0" style={{ color: '#f97316' }}>S/. {p.price.toLocaleString('es-PE')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
