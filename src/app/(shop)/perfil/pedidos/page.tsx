import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ArrowLeft, ShoppingBag, Package, Truck, Check, X, Clock, ImageIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Clock   },
  CONFIRMED: { label: 'Confirmado', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: Check   },
  SHIPPED:   { label: 'Enviado',    color: '#a855f7', bg: 'rgba(168,85,247,0.12)', icon: Truck   },
  DELIVERED: { label: 'Entregado',  color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: Package },
  CANCELLED: { label: 'Cancelado',  color: '#f87171', bg: 'rgba(239,68,68,0.12)',   icon: X       },
}

const payLabels: Record<string, string> = {
  card: 'Tarjeta', yape: 'Yape', plin: 'Plin', cash: 'Contra entrega',
}

export default async function PedidosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      <div className="fixed top-20 left-10 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#3b82f6' }} />
      <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: '#f97316' }} />

      <div className="flex items-center gap-3 mb-2">
        <Link href="/perfil" className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          <ArrowLeft size={15} /> Perfil
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} style={{ color: '#f97316' }} />
          <h1 className="text-2xl font-bold text-white">Mis pedidos</h1>
          <span className="text-sm px-2 py-0.5 rounded-full font-semibold ml-1"
            style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
            {orders.length}
          </span>
        </div>
        <div className="h-px mt-2 w-40" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-2xl space-y-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ShoppingBag size={48} className="mx-auto opacity-20" style={{ color: '#fff' }} />
          <p className="text-lg font-semibold text-white">Aún no tienes pedidos</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold mt-2"
            style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}>
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon
            return (
              <div key={order.id}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Order header */}
                <div className="flex items-center justify-between px-5 py-4 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                      {payLabels[order.payMethod] ?? order.payMethod}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: status.bg, color: status.color }}>
                      <StatusIcon size={11} /> {status.label}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-3 space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />
                          : <ImageIcon size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                      </div>
                      <p className="flex-1 text-sm text-white truncate">{item.name}</p>
                      <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>x{item.quantity}</span>
                      <span className="text-sm font-semibold text-white shrink-0">
                        S/. {(item.price * item.quantity).toLocaleString('es-PE')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
                  <Link
                    href={`/perfil/pedidos/${order.id}`}
                    className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: '#3b82f6' }}
                  >
                    Ver seguimiento <ChevronRight size={12} />
                  </Link>
                  <p className="text-base font-bold" style={{ color: '#f97316' }}>
                    S/. {order.total.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
