'use client'

import { useState, useTransition } from 'react'
import { saveSettings } from './actions'
import { Save, Check, Truck, Megaphone, Phone, Mail, Clock } from 'lucide-react'

interface Props {
  settings: Record<string, string>
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#fff',
  padding: '10px 14px',
  width: '100%',
  fontSize: 14,
  outline: 'none',
} as React.CSSProperties

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.35)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.07em',
  display: 'block',
  marginBottom: 6,
}

function Section({ title, color, icon: Icon, children }: {
  title: string; color: string; icon: React.ElementType; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20` }}>
      <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function ConfigForm({ settings }: Props) {
  const [values, setValues] = useState({ ...settings })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await saveSettings(values)
      if (result.error) { setError(result.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  return (
    <div className="space-y-5">

      <Section title="Announcement bar" color="#3b82f6" icon={Megaphone}>
        <div>
          <label style={labelStyle}>Texto del anuncio</label>
          <input
            value={values.announcement ?? ''}
            onChange={e => set('announcement', e.target.value)}
            style={inputStyle}
            placeholder="ENVÍO GRATIS en compras superiores a S/. 500 | ..."
          />
          <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {'Usa "|" para separar dos mensajes que rotarán.'}
          </p>
        </div>
      </Section>

      <Section title="Envío" color="#f97316" icon={Truck}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Costo de envío (S/.)</label>
            <input
              type="number" min="0"
              value={values.shipping_cost ?? '15'}
              onChange={e => set('shipping_cost', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Envío gratis a partir de (S/.)</label>
            <input
              type="number" min="0"
              value={values.shipping_threshold ?? '500'}
              onChange={e => set('shipping_threshold', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </Section>

      <Section title="Contacto" color="#a855f7" icon={Phone}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label style={labelStyle}>
              <Phone size={10} className="inline mr-1" />WhatsApp (sin +)
            </label>
            <input
              value={values.whatsapp ?? ''}
              onChange={e => set('whatsapp', e.target.value)}
              style={inputStyle}
              placeholder="51958173765"
            />
          </div>
          <div>
            <label style={labelStyle}>
              <Mail size={10} className="inline mr-1" />Correo de contacto
            </label>
            <input
              type="email"
              value={values.contact_email ?? ''}
              onChange={e => set('contact_email', e.target.value)}
              style={inputStyle}
              placeholder="contacto@smartshop.pe"
            />
          </div>
          <div>
            <label style={labelStyle}>
              <Clock size={10} className="inline mr-1" />Horario de atención
            </label>
            <input
              value={values.schedule ?? ''}
              onChange={e => set('schedule', e.target.value)}
              style={inputStyle}
              placeholder="Lun – Sáb · 9:00am – 8:00pm"
            />
          </div>
        </div>
      </Section>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={pending}
        className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        style={{
          background: saved ? 'rgba(52,211,153,0.2)' : 'linear-gradient(90deg,#ea580c,#f97316)',
          border: saved ? '1px solid rgba(52,211,153,0.4)' : 'none',
          boxShadow: saved ? 'none' : '0 4px 20px rgba(249,115,22,0.3)',
          color: saved ? '#34d399' : '#fff',
        }}
      >
        {pending ? (
          <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Guardando...</>
        ) : saved ? (
          <><Check size={15} /> Guardado</>
        ) : (
          <><Save size={15} /> Guardar cambios</>
        )}
      </button>
    </div>
  )
}
