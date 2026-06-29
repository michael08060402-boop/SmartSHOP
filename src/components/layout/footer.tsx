'use client'

import Link from 'next/link'

const quickLinks = [
  { label: 'Inicio',       href: '/'           },
  { label: 'Laptops & PCs', href: '/categoria/laptops'      },
  { label: 'Smartphones',  href: '/categoria/smartphones'   },
  { label: 'Gaming',       href: '/categoria/gaming'        },
  { label: 'Buscar',       href: '/buscar'      },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: '#e1306c',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877f2',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
      </svg>
    ),
    color: '#fff',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/51958173765',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: '#25d366',
  },
]

const payMethods = [
  {
    label: 'Yape',
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.3)',
    icon: <img src="/yape.png" alt="Yape" className="h-7 w-auto object-contain" />,
  },
  {
    label: 'Plin',
    bg: 'rgba(6,182,212,0.15)',
    border: 'rgba(6,182,212,0.3)',
    icon: <img src="/plin.png" alt="Plin" className="h-7 w-auto object-contain" />,
  },
  {
    label: 'Visa',
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.3)',
    icon: <img src="/visa.png" alt="Visa" className="h-7 w-auto object-contain" />,
  },
  {
    label: 'Mastercard',
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.3)',
    icon: <img src="/mastercard.png" alt="Mastercard" className="h-7 w-auto object-contain" />,
  },
]

export function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #080c18 0%, #060912 100%)',
        borderTop: '1px solid rgba(59,130,246,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/icon.png" alt="SmartSHOP" className="w-20 h-20 object-contain" />
              <span className="font-bold text-2xl tracking-tight">
                <span style={{ color: '#3b82f6' }}>Smart</span>
                <span style={{ color: '#f97316' }}>SHOP</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Tu tienda de tecnología de confianza en Perú. Laptops, smartphones, gaming y más — al mejor precio con garantía oficial.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2.5 mt-5">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = s.color
                    e.currentTarget.style.borderColor = s.color + '55'
                    e.currentTarget.style.background = s.color + '18'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold mb-4 tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              NAVEGACIÓN
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f97316' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold mb-4 tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              CONTACTO
            </p>
            <ul className="space-y-3">
              <li>
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>WHATSAPP</p>
                <a
                  href="https://wa.me/51958173765"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#25d366' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  +51 958 173 765
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>CORREO</p>
                <a
                  href="mailto:contacto@smartshop.pe"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#3b82f6' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
                >
                  contacto@smartshop.pe
                </a>
              </li>
              <li>
                <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>HORARIO</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Lun – Sáb · 9:00am – 8:00pm
                </p>
              </li>
            </ul>
          </div>

          {/* Payment methods */}
          <div>
            <p className="text-xs font-bold mb-4 tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              MÉTODOS DE PAGO
            </p>
            <div className="grid grid-cols-2 gap-2">
              {payMethods.map(m => (
                <div
                  key={m.label}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: m.bg, border: `1px solid ${m.border}` }}
                >
                  {m.icon}
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Pagos seguros con encriptación SSL de 256 bits.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} SmartSHOP. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Hecho en Perú 🇵🇪
          </p>
        </div>

      </div>
    </footer>
  )
}
