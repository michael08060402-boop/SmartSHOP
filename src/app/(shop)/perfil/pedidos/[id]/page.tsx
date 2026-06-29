import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ArrowLeft, Clock, Check, Truck, Package, X, ImageIcon } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  { key: 'PENDING',   label: 'Pendiente',  icon: Clock,    desc: 'Pedido recibido' },
  { key: 'CONFIRMED', label: 'Confirmado', icon: Check,    desc: 'Pago verificado' },
  { key: 'SHIPPED',   label: 'En camino',  icon: Truck,    desc: 'Salió a repartir' },
  { key: 'DELIVERED', label: 'Entregado',  icon: Package,  desc: 'Recibido con éxito' },
] as const

const payLabels: Record<string, string> = {
  card: 'Tarjeta de crédito/débito',
  yape: 'Yape',
  plin: 'Plin',
  cash: 'Contra entrega',
}

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const order = await db.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true },
  })
  if (!order) notFound()

  const isCancelled = order.status === 'CANCELLED'
  const currentIdx = isCancelled
    ? -1
    : STEPS.findIndex(s => s.key === order.status)

  const orderDate = new Date(order.createdAt)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      <div className="fixed top-20 left-10 w-64 h-64 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#3b82f6' }} />
      <div className="fixed bottom-20 right-10 w-56 h-56 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: '#f97316' }} />

      <Link href="/perfil/pedidos" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        <ArrowLeft size={15} /> Mis pedidos
      </Link>

      {/* Order meta */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Pedido #{order.id.slice(-8).toUpperCase()}
            </p>
            <h1 className="text-xl font-bold text-white">Seguimiento del pedido</h1>
            <div className="h-px mt-2 w-40" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {orderDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {payLabels[order.payMethod] ?? order.payMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {isCancelled ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid #f87171' }}>
              <X size={18} style={{ color: '#f87171' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#f87171' }}>Pedido cancelado</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Este pedido fue cancelado</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-5 left-5 right-5 h-0.5"
              style={{ background: 'rgba(255,255,255,0.08)', zIndex: 0 }}
            />
            <div
              className="absolute top-5 left-5 h-0.5 transition-all duration-700"
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #f97316)',
                width: currentIdx < 0 ? '0%' : `${(currentIdx / (STEPS.length - 1)) * 100}%`,
                zIndex: 1,
              }}
            />

            <div className="relative z-10 flex justify-between">
              {STEPS.map((step, i) => {
                const done = i <= currentIdx
                const active = i === currentIdx
                const StepIcon = step.icon
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: done
                          ? active
                            ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                            : 'rgba(52,211,153,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${done ? (active ? '#3b82f6' : '#34d399') : 'rgba(255,255,255,0.12)'}`,
                        boxShadow: active ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
                      }}
                    >
                      <StepIcon
                        size={16}
                        style={{ color: done ? (active ? '#fff' : '#34d399') : 'rgba(255,255,255,0.25)' }}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: done ? (active ? '#fff' : '#34d399') : 'rgba(255,255,255,0.3)' }}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-sm font-semibold text-white">Productos ({order.items.length})</p>
        </div>
        <div className="px-5 py-3 space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />
                  : <ImageIcon size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />}
              </div>
              <p className="flex-1 text-sm text-white truncate">{item.name}</p>
              <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>×{item.quantity}</span>
              <span className="text-sm font-semibold text-white shrink-0">
                S/. {(item.price * item.quantity).toLocaleString('es-PE')}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.12)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Total</p>
          <p className="text-lg font-bold" style={{ color: '#f97316' }}>
            S/. {order.total.toLocaleString('es-PE')}
          </p>
        </div>
      </div>

      {/* Delivery info */}
      <div
        className="rounded-2xl p-5 space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>DIRECCIÓN DE ENTREGA</p>
        <p className="text-sm text-white">{order.address}</p>
        {order.phone && (
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Tel: {order.phone}</p>
        )}
      </div>
    </div>
  )
}
