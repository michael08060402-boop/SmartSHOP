'use client'

import { useCart } from '@/context/cart-context'
import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, Shield, ImageIcon, Check, Lock, Smartphone, Banknote, MapPin, Pencil, Loader2 } from 'lucide-react'
import { createOrder } from './actions'
import type { MapData } from '@/components/map/map-picker'

const MapPickerDynamic = dynamic(
  () => import('@/components/map/map-picker').then(m => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 280, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}
        className="animate-pulse flex items-center justify-center">
        <Loader2 size={20} style={{ color: 'rgba(255,255,255,0.2)' }} className="animate-spin" />
      </div>
    ),
  }
)

const MapViewDynamic = dynamic(
  () => import('@/components/map/map-view').then(m => m.MapView),
  { ssr: false }
)

interface Props {
  userName: string
  userEmail: string
  savedAddress?: string
  savedPhone?: string
  savedLat?: number | null
  savedLng?: number | null
  savedRef?: string | null
  shippingCost?: number
  shippingThreshold?: number
}

type PayMethod = 'card' | 'yape' | 'plin' | 'cash'

const payMethods: { id: PayMethod; label: string; desc: string; color: string; border: string; glow: string }[] = [
  { id: 'card', label: 'Tarjeta',        desc: 'Debito o credito', color: '#3b82f6', border: 'rgba(59,130,246,0.5)',  glow: 'rgba(59,130,246,0.2)'  },
  { id: 'yape', label: 'Yape',           desc: 'Codigo de pago',   color: '#a855f7', border: 'rgba(168,85,247,0.5)', glow: 'rgba(168,85,247,0.2)' },
  { id: 'plin', label: 'Plin',           desc: 'Codigo de pago',   color: '#06b6d4', border: 'rgba(6,182,212,0.5)',  glow: 'rgba(6,182,212,0.2)'  },
  { id: 'cash', label: 'Contra entrega', desc: 'Paga al recibir',  color: '#34d399', border: 'rgba(52,211,153,0.5)', glow: 'rgba(52,211,153,0.2)' },
]

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
}

export function CheckoutClient({
  userName, userEmail,
  savedAddress = '', savedPhone = '',
  savedLat = null, savedLng = null, savedRef = null,
  shippingCost = 15, shippingThreshold = 500,
}: Props) {
  const { items, total, clearCart } = useCart()

  const [payMethod,    setPayMethod]    = useState<PayMethod | null>(null)
  const [step,         setStep]         = useState<'form' | 'success'>('form')
  const [loading,      setLoading]      = useState(false)
  const [orderError,   setOrderError]   = useState<string | null>(null)
  const [imgErrors,    setImgErrors]    = useState<Record<string, boolean>>({})
  const [deliveryRef,  setDeliveryRef]  = useState(savedRef ?? '')
  const [showPicker,   setShowPicker]   = useState(!savedLat || !savedLng)
  const [mapData,      setMapData]      = useState<MapData | null>(
    savedLat && savedLng ? { address: savedAddress, lat: savedLat, lng: savedLng } : null
  )

  const formRef = useRef<HTMLFormElement>(null)

  const shipping    = total >= shippingThreshold ? 0 : shippingCost
  const finalTotal  = total + shipping
  const canSubmit   = !!payMethod && !!mapData

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 14,
    padding: '14px 16px',
    width: '100%',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 7,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = '#3b82f6'
    e.target.style.boxShadow   = '0 0 0 3px rgba(59,130,246,0.15)'
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.boxShadow   = 'none'
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!payMethod || !mapData) return
    setLoading(true)
    setOrderError(null)

    const fd      = new FormData(e.currentTarget)
    const phone   = (fd.get('phone') as string ?? '').trim()
    const address = deliveryRef.trim()
      ? `${mapData.address} · Ref: ${deliveryRef.trim()}`
      : mapData.address

    const result = await createOrder({
      items: items.map(i => ({ productId: i.id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
      total: finalTotal,
      shipping,
      payMethod,
      address,
      phone,
    })

    if ('error' in result) {
      setOrderError(result.error ?? 'Error al crear el pedido')
      setLoading(false)
      return
    }
    clearCart()
    setStep('success')
    setLoading(false)
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">🛒</div>
        <p className="text-white font-semibold text-lg">Tu carrito esta vacio</p>
        <Link href="/" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)' }}>
          Explorar productos
        </Link>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.4)' }}>
          <Check size={36} style={{ color: '#34d399' }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Pedido confirmado!</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Gracias por tu compra. Puedes ver el estado de tu pedido en "Mis pedidos".
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/perfil/pedidos"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)' }}>
            Ver mis pedidos
          </Link>
          <Link href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Seguir comprando
          </Link>
        </div>
      </div>
    )
  }

  const selectedMethod = payMethods.find(m => m.id === payMethod)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Ambient blobs */}
      <div className="fixed top-20 left-10 w-80 h-80 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#3b82f6' }} />
      <div className="fixed bottom-20 right-10 w-72 h-72 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: '#f97316' }} />

      <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'rgba(255,255,255,0.35)' }}>
        <ArrowLeft size={15} /> Volver al catalogo
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Finalizar compra</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">

          {/* Shipping */}
          <div style={glass} className="p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <Truck size={16} style={{ color: '#3b82f6' }} />
              </div>
              <h2 className="font-semibold text-white text-base">Datos de envio</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Nombre</label>
                <input required defaultValue={userName.split(' ')[0]} placeholder="Juan"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input required defaultValue={userName.split(' ')[1] ?? ''} placeholder="Perez"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Correo electronico</label>
              <input required type="email" defaultValue={userEmail} placeholder="correo@ejemplo.com"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            <div>
              <label style={labelStyle}>Telefono</label>
              <input name="phone" required type="tel" placeholder="+51 999 999 999"
                defaultValue={savedPhone}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Map / delivery point */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <div className="flex items-center justify-between mb-3">
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  <MapPin size={10} className="inline mr-1" />
                  Punto de entrega
                  {mapData && !showPicker && (
                    <span className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                      Configurado
                    </span>
                  )}
                </label>
                {mapData && (
                  <button
                    type="button"
                    onClick={() => setShowPicker(p => !p)}
                    className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Pencil size={11} />
                    {showPicker ? 'Cancelar' : 'Cambiar'}
                  </button>
                )}
              </div>

              {/* Mini map view */}
              {mapData && !showPicker ? (
                <div className="space-y-2">
                  <MapViewDynamic lat={mapData.lat} lng={mapData.lng} height={160} />
                  <div style={{
                    background: 'rgba(249,115,22,0.06)',
                    border: '1px solid rgba(249,115,22,0.18)',
                    borderRadius: 10,
                    padding: '8px 12px',
                    display: 'flex',
                    gap: 7,
                    alignItems: 'flex-start',
                  }}>
                    <MapPin size={12} style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{mapData.address}</p>
                  </div>
                </div>
              ) : (
                <MapPickerDynamic
                  defaultLat={mapData?.lat}
                  defaultLng={mapData?.lng}
                  defaultAddress={mapData?.address}
                  onChange={(data) => {
                    setMapData(data)
                    setShowPicker(false)
                  }}
                />
              )}
            </div>

            {/* Reference */}
            <div>
              <label style={labelStyle}>Referencia (opcional)</label>
              <input
                value={deliveryRef}
                onChange={e => setDeliveryRef(e.target.value)}
                placeholder="Porton azul, 2do piso, frente al parque..."
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Ayuda al repartidor a encontrarte
              </p>
            </div>
          </div>

          {/* Payment method */}
          <div style={glass} className="p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                <CreditCard size={16} style={{ color: '#f97316' }} />
              </div>
              <h2 className="font-semibold text-white text-base">Metodo de pago</h2>
              <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <Lock size={10} /> Pago seguro
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {payMethods.map(m => (
                <button key={m.id} type="button" onClick={() => setPayMethod(m.id)}
                  className="flex flex-col items-center gap-3 py-5 px-2 rounded-2xl transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: payMethod === m.id ? `rgba(${hexToRgb(m.color)}, 0.1)` : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${payMethod === m.id ? m.border : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: payMethod === m.id ? `0 0 20px ${m.glow}` : 'none',
                    backdropFilter: 'blur(10px)',
                  }}>
                  <PayIcon id={m.id} color={m.color} selected={payMethod === m.id} />
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: payMethod === m.id ? m.color : 'rgba(255,255,255,0.8)' }}>
                      {m.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.desc}</p>
                  </div>
                  {payMethod === m.id && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: m.color }}>
                      <Check size={9} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Card form */}
            {payMethod === 'card' && (
              <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div>
                  <label style={labelStyle}>Numero de tarjeta</label>
                  <input required placeholder="1234 5678 9012 3456" maxLength={19}
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                      e.target.value = v.replace(/(.{4})/g, '$1 ').trim()
                    }} />
                </div>
                <div>
                  <label style={labelStyle}>Nombre en la tarjeta</label>
                  <input required placeholder="JUAN PEREZ"
                    style={{ ...inputStyle, textTransform: 'uppercase' }}
                    onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Vencimiento</label>
                    <input required placeholder="MM/AA" maxLength={5}
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '')
                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4)
                        e.target.value = v
                      }} />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input required placeholder="•••" maxLength={4} type="password"
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>
            )}

            {/* Yape / Plin */}
            {(payMethod === 'yape' || payMethod === 'plin') && (
              <div className="space-y-4 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{
                    background: payMethod === 'yape' ? 'rgba(168,85,247,0.08)' : 'rgba(6,182,212,0.08)',
                    border: `1px solid ${payMethod === 'yape' ? 'rgba(168,85,247,0.25)' : 'rgba(6,182,212,0.25)'}`,
                  }}>
                  <Smartphone size={16} style={{ color: payMethod === 'yape' ? '#a855f7' : '#06b6d4', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Realiza el pago de{' '}
                    <span className="font-bold text-white">S/. {finalTotal.toLocaleString('es-PE')}</span>{' '}
                    por {payMethod === 'yape' ? 'Yape' : 'Plin'} al numero{' '}
                    <span className="font-bold" style={{ color: payMethod === 'yape' ? '#a855f7' : '#06b6d4' }}>
                      +51 958 173 765
                    </span>{' '}
                    y luego completa los datos abajo.
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Tu numero de {payMethod === 'yape' ? 'Yape' : 'Plin'}</label>
                  <input required type="tel" placeholder="+51 999 999 999"
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label style={labelStyle}>Codigo de aprobacion</label>
                  <input required placeholder="Ej: 123456"
                    style={{
                      ...inputStyle,
                      letterSpacing: '0.2em', fontWeight: 700, fontSize: 16,
                      borderColor: payMethod === 'yape' ? 'rgba(168,85,247,0.3)' : 'rgba(6,182,212,0.3)',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = payMethod === 'yape' ? '#a855f7' : '#06b6d4'
                      e.target.style.boxShadow   = `0 0 0 3px ${payMethod === 'yape' ? 'rgba(168,85,247,0.15)' : 'rgba(6,182,212,0.15)'}`
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = payMethod === 'yape' ? 'rgba(168,85,247,0.3)' : 'rgba(6,182,212,0.3)'
                      e.target.style.boxShadow   = 'none'
                    }}
                  />
                  <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    El codigo aparece en tu app despues de realizar el pago
                  </p>
                </div>
              </div>
            )}

            {/* Cash */}
            {payMethod === 'cash' && (
              <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
                  <Banknote size={18} style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p className="text-sm font-semibold text-white">Pago al recibir</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Tendras que pagar{' '}
                      <span className="font-bold text-white">S/. {finalTotal.toLocaleString('es-PE')}</span>{' '}
                      en efectivo cuando llegue tu pedido. Ten el monto exacto si es posible.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {orderError && (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
              {orderError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-5 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: canSubmit ? 'linear-gradient(90deg, #ea580c, #f97316)' : 'rgba(255,255,255,0.08)',
              boxShadow: canSubmit ? '0 4px 28px rgba(249,115,22,0.4)' : 'none',
            }}
          >
            {loading ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Procesando...</>
            ) : !mapData ? (
              <><MapPin size={14} /> Selecciona tu punto de entrega</>
            ) : !payMethod ? (
              'Selecciona un metodo de pago'
            ) : (
              <><Lock size={14} /> Confirmar pedido · S/. {finalTotal.toLocaleString('es-PE')}</>
            )}
          </button>

          <p className="text-center text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <Shield size={9} className="inline mr-1" />
            Informacion protegida con encriptacion SSL de 256 bits
          </p>
        </form>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div style={glass} className="p-5 space-y-4">
              <h2 className="font-semibold text-white text-base">Resumen del pedido</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {item.image && !imgErrors[item.id] ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1"
                          onError={() => setImgErrors(p => ({ ...p, [item.id]: true }))} />
                      ) : (
                        <ImageIcon size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0">
                      S/. {(item.price * item.quantity).toLocaleString('es-PE')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <span>Subtotal</span>
                  <span>S/. {total.toLocaleString('es-PE')}</span>
                </div>
                <div className="flex justify-between text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <span>Envio</span>
                  <span style={{ color: shipping === 0 ? '#34d399' : undefined }}>
                    {shipping === 0 ? 'Gratis' : `S/. ${shipping.toLocaleString('es-PE')}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs" style={{ color: '#34d399' }}>Envio gratis por compras +S/. {shippingThreshold.toLocaleString('es-PE')}</p>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.07)', color: '#fff' }}>
                  <span>Total</span>
                  <span style={{ color: '#f97316' }}>S/. {finalTotal.toLocaleString('es-PE')}</span>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: 'SSL Seguro', color: '#3b82f6' },
                { icon: Lock,   label: 'Encriptado', color: '#f97316' },
                { icon: Check,  label: 'Verificado',  color: '#34d399' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={14} style={{ color }} />
                  <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function PayIcon({ id, color, selected }: { id: PayMethod; color: string; selected: boolean }) {
  if (id === 'cash') return (
    <img src="/contraentrega.png" alt="Contra entrega" className="h-8 w-auto object-contain" style={{ opacity: selected ? 1 : 0.5 }} />
  )
  if (id === 'card') return (
    <div className="flex items-center gap-1">
      <img src="/visa.png" alt="Visa" className="h-5 w-auto object-contain" style={{ opacity: selected ? 1 : 0.5 }} />
      <img src="/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" style={{ opacity: selected ? 1 : 0.5 }} />
    </div>
  )
  if (id === 'yape') return (
    <img src="/yape.png" alt="Yape" className="h-8 w-auto object-contain" style={{ opacity: selected ? 1 : 0.5 }} />
  )
  return (
    <img src="/plin.png" alt="Plin" className="h-8 w-auto object-contain" style={{ opacity: selected ? 1 : 0.5 }} />
  )
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
