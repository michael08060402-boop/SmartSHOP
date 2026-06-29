import { AuthForm } from '@/components/auth/auth-form'
import Image from 'next/image'

const reviews = [
  { name: 'María G.',  text: '¡Increíble experiencia de compra! 🛍️', stars: 5, style: { top: '8%',    left: '3%'  }, delay: '0s',   rotate: '-4deg', accent: 'orange' },
  { name: 'Carlos R.', text: 'Entrega rapidísima, lo recomiendo.',    stars: 5, style: { top: '8%',    right: '3%' }, delay: '1s',   rotate: '4deg',  accent: 'blue'   },
  { name: 'Ana P.',    text: 'Los mejores precios del mercado 🔥',    stars: 4, style: { top: '42%',   left: '1%'  }, delay: '2s',   rotate: '-2deg', accent: 'blue'   },
  { name: 'Luis M.',   text: 'Atención al cliente 10/10 ⭐',          stars: 5, style: { top: '42%',   right: '1%' }, delay: '0.6s', rotate: '3deg',  accent: 'orange' },
  { name: 'Sofia T.',  text: 'Nunca más compro en otro lado 💯',      stars: 5, style: { bottom: '8%', left: '3%'  }, delay: '1.8s', rotate: '2deg',  accent: 'orange' },
  { name: 'Diego F.',  text: 'Productos de alta calidad siempre.',    stars: 4, style: { bottom: '8%', right: '3%' }, delay: '1.4s', rotate: '-3deg', accent: 'blue'   },
]

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10 md:px-20 lg:px-80"
      style={{ background: '#06060f' }}
    >
      {/* Fondo: blobs naranja y azul prominentes */}
      <div className="absolute inset-0 grid-pattern opacity-[0.18]" />

      {/* Blob azul — arriba centro */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[90px] opacity-70 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #1d6ef7 0%, #0a3ab4 60%, transparent 100%)' }} />

      {/* Blob naranja — abajo izquierda */}
      <div className="absolute -bottom-24 left-0 w-[700px] h-[500px] rounded-full blur-[80px] opacity-65 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #f97316 0%, #c2410c 60%, transparent 100%)' }} />

      {/* Blob naranja suave — arriba izquierda */}
      <div className="absolute top-0 left-0 w-[450px] h-[350px] rounded-full blur-[70px] opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #fb923c 0%, transparent 70%)' }} />

      {/* Blob azul — derecha centro */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[80px] opacity-55 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, #1e40af 60%, transparent 100%)' }} />

      {/* Blob naranja accent — abajo derecha */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[350px] rounded-full blur-[70px] opacity-45 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #ea580c 0%, transparent 70%)' }} />

      {/* Floating review cards — hidden on mobile */}
      {reviews.map((r) => {
        const isOrange = r.accent === 'orange'
        const accentColor  = isOrange ? '#f97316' : '#3b82f6'
        const accentGlow   = isOrange ? 'rgba(249,115,22,0.45)' : 'rgba(59,130,246,0.45)'
        const borderColor  = isOrange ? 'rgba(249,115,22,0.85)' : 'rgba(59,130,246,0.85)'
        const bgColor      = isOrange ? 'rgba(249,115,22,0.15)' : 'rgba(59,130,246,0.15)'
        const starEmpty    = isOrange ? 'rgba(249,115,22,0.35)' : 'rgba(59,130,246,0.35)'
        return (
        <div
          key={r.name}
          className="hidden lg:block absolute z-20 rounded-2xl px-4 py-3.5 w-56 shadow-xl"
          style={{
            ...r.style,
            transform: `rotate(${r.rotate})`,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(18px)',
            boxShadow: `0 8px 40px ${accentGlow}, 0 0 16px ${accentGlow}, 0 0 0 1px ${borderColor}`,
            animation: 'float 4s ease-in-out infinite',
            animationDelay: r.delay,
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: accentGlow, border: `1px solid ${accentColor}`, color: accentColor }}
            >
              {r.name[0]}
            </div>
            <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.88)' }}>{r.name}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)' }}>{r.text}</p>
          <div className="flex gap-0.5 mt-1.5">
            {Array.from({ length: r.stars }).map((_, i) => (
              <span key={i} className="text-xs" style={{ color: accentColor }}>★</span>
            ))}
            {Array.from({ length: 5 - r.stars }).map((_, i) => (
              <span key={i} className="text-xs" style={{ color: starEmpty }}>★</span>
            ))}
          </div>
        </div>
        )
      })}

      {/* Main card */}
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex relative z-10"
        style={{
          minHeight: '580px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 60px rgba(249,115,22,0.12), 0 0 100px rgba(59,130,246,0.10)',
        }}
      >
        {/* Left panel */}
        <div
          className="hidden md:flex flex-col justify-between p-10 w-[45%] relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0d1f3c 0%, #0a0f1e 40%, #1a0a05 80%, #0f0806 100%)' }}
        >
          <div className="absolute inset-0 grid-pattern opacity-10" />
          {/* azul arriba izquierda */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-50" style={{ background: '#1d4ed8' }} />
          {/* naranja abajo derecha */}
          <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full blur-3xl opacity-45" style={{ background: '#ea580c' }} />
          {/* naranja arriba derecha sutil */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-30" style={{ background: '#f97316' }} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border opacity-12" style={{ borderColor: '#3b82f6' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border opacity-15" style={{ borderColor: '#f97316' }} />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[92%]">
            <Image src="/icon.png" alt="SmartSHOP" width={500} height={500} className="drop-shadow-2xl w-full h-auto" priority />
          </div>

          <div className="relative z-10 text-center">
            <span className="font-bold text-3xl tracking-tight">
              <span style={{ color: '#3b82f6' }}>Smart</span>
              <span style={{ color: '#f97316' }}>SHOP</span>
            </span>
          </div>

          <div className="relative z-10 space-y-1.5 text-center">
            <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Miles de clientes confían en nosotros.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Compra rápido, seguro y desde cualquier lugar.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #08101f 0%, #0c0c18 50%, #100804 100%)' }}
        >
          {/* blob naranja sutil fondo del form */}
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: '#f97316' }} />
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: '#3b82f6' }} />
          <div className="w-full max-w-xs relative z-10">
            <div className="md:hidden mb-8 flex items-center gap-3">
              <Image src="/icon.png" alt="SmartSHOP" width={56} height={56} />
              <span className="font-bold text-2xl tracking-tight">
                <span style={{ color: '#3b82f6' }}>Smart</span>
                <span style={{ color: '#f97316' }}>SHOP</span>
              </span>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          50%       { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </main>
  )
}
