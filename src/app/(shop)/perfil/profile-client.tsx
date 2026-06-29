
'use client'

import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { User, Mail, Lock, ShoppingBag, Shield, Save, Loader2, Check, Eye, EyeOff, MapPin } from 'lucide-react'
import Link from 'next/link'
import { updateProfile, changePassword } from './actions'
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

interface Props {
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    password: boolean
    address: string | null
    addressLat: number | null
    addressLng: number | null
    addressRef: string | null
    phone: string | null
    createdAt: Date
    role: string
  }
  orderCount: number
}

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  borderRadius: 12,
  padding: '13px 16px',
  width: '100%',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 7,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

export function ProfileClient({ user, orderCount }: Props) {
  const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [passMsg,    setPassMsg]    = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [showCurr,   setShowCurr]  = useState(false)
  const [showNew,    setShowNew]   = useState(false)
  const [isPendingProfile, startProfile] = useTransition()
  const [isPendingPass,    startPass]    = useTransition()

  const [mapData, setMapData] = useState<MapData | null>(
    user.addressLat && user.addressLng
      ? { address: user.address ?? '', lat: user.addressLat, lng: user.addressLng }
      : null
  )
  const [refVal, setRefVal] = useState(user.addressRef ?? '')

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd    = new FormData(e.currentTarget)
    const name  = (fd.get('name')  as string ?? '').trim()
    const phone = (fd.get('phone') as string ?? '').trim()
    setProfileMsg(null)
    startProfile(async () => {
      const res = await updateProfile({
        name,
        phone,
        address:    mapData?.address ?? '',
        addressLat: mapData?.lat     ?? null,
        addressLng: mapData?.lng     ?? null,
        addressRef: refVal.trim(),
      })
      setProfileMsg(res.success
        ? { type: 'ok', text: 'Perfil actualizado' }
        : { type: 'err', text: res.error! })
    })
  }

  function handlePass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setPassMsg(null)
    startPass(async () => {
      const res = await changePassword(fd)
      if (res.success) {
        setPassMsg({ type: 'ok', text: 'Contrasena cambiada correctamente' })
        ;(e.target as HTMLFormElement).reset()
      } else {
        setPassMsg({ type: 'err', text: res.error! })
      }
    })
  }

  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? 'U'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* Ambient */}
      <div className="fixed top-20 left-10 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#3b82f6' }} />
      <div className="fixed bottom-20 right-10 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: '#f97316' }} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
        <div className="h-px mt-2 w-40" style={{ background: 'linear-gradient(90deg, #3b82f6, #f97316, transparent)' }} />
      </div>

      {/* Avatar + stats */}
      <div style={glass} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #f97316)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
          {user.image
            ? <img src={user.image} alt="" className="w-full h-full rounded-2xl object-cover" />
            : initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{user.name ?? 'Sin nombre'}</h2>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            {user.role === 'ADMIN' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}>
                ADMIN
              </span>
            )}
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0">
          <Link href="/perfil/pedidos"
            className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all hover:scale-105"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <ShoppingBag size={18} style={{ color: '#f97316' }} />
            <span className="text-lg font-bold text-white">{orderCount}</span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Pedidos</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Edit profile */}
        <form onSubmit={handleProfile} style={glass} className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <User size={15} style={{ color: '#3b82f6' }} />
            </div>
            <h3 className="font-semibold text-white">Datos personales</h3>
          </div>

          <div>
            <label style={labelStyle}>Nombre completo</label>
            <input name="name" required defaultValue={user.name ?? ''} placeholder="Tu nombre"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
          </div>

          <div>
            <label style={labelStyle}>Correo electronico</label>
            <input value={user.email ?? ''} disabled
              style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }} />
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>El correo no se puede cambiar</p>
          </div>

          <div>
            <label style={labelStyle}>Telefono</label>
            <input name="phone" type="tel" defaultValue={user.phone ?? ''} placeholder="+51 999 999 999"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
          </div>

          {/* Map section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <div className="flex items-center justify-between mb-3">
              <label style={{ ...labelStyle, marginBottom: 0 }}>
                <MapPin size={10} className="inline mr-1" />
                Direccion de entrega
              </label>
              {mapData && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                  Guardada
                </span>
              )}
            </div>
            <MapPickerDynamic
              defaultLat={user.addressLat}
              defaultLng={user.addressLng}
              defaultAddress={user.address}
              onChange={setMapData}
            />
          </div>

          {/* Reference */}
          <div>
            <label style={labelStyle}>Referencia</label>
            <input
              value={refVal}
              onChange={e => setRefVal(e.target.value)}
              placeholder="Porton azul, 2do piso, frente al parque..."
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
            />
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Ayuda al repartidor a encontrarte
            </p>
          </div>

          {profileMsg && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{
                background: profileMsg.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                color: profileMsg.type === 'ok' ? '#34d399' : '#f87171',
                border: `1px solid ${profileMsg.type === 'ok' ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
              {profileMsg.type === 'ok' ? <Check size={14} /> : null}
              {profileMsg.text}
            </div>
          )}

          <button type="submit" disabled={isPendingProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)', color: '#fff' }}>
            {isPendingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Guardar cambios
          </button>
        </form>

        {/* Change password */}
        <form onSubmit={handlePass} style={glass} className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
              <Lock size={15} style={{ color: '#f97316' }} />
            </div>
            <h3 className="font-semibold text-white">Cambiar contrasena</h3>
          </div>

          {!user.password ? (
            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Shield size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Tu cuenta usa Google para iniciar sesion. No tienes contrasena que cambiar.
              </p>
            </div>
          ) : (
            <>
              {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field, i) => {
                const labels = ['Contrasena actual', 'Nueva contrasena', 'Confirmar nueva contrasena']
                const show = i === 0 ? showCurr : showNew
                const setShow = i === 0 ? setShowCurr : setShowNew
                return (
                  <div key={field} className="relative">
                    <label style={labelStyle}>{labels[i]}</label>
                    <input name={field} required type={show ? 'text' : 'password'}
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }}
                      onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
                    {i < 2 && (
                      <button type="button" onClick={() => setShow(!show)}
                        className="absolute right-3 top-[38px] transition-opacity hover:opacity-70"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                )
              })}

              {passMsg && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{
                    background: passMsg.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                    color: passMsg.type === 'ok' ? '#34d399' : '#f87171',
                    border: `1px solid ${passMsg.type === 'ok' ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}>
                  {passMsg.type === 'ok' ? <Check size={14} /> : null}
                  {passMsg.text}
                </div>
              )}

              <button type="submit" disabled={isPendingPass}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg, #ea580c, #f97316)', color: '#fff' }}>
                {isPendingPass ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Cambiar contrasena
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
