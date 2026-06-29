'use client'

import { useState, useTransition } from 'react'
import { signIn } from 'next-auth/react'
import { loginUser, registerUser } from '@/app/(auth)/actions'
import { Eye, EyeOff } from 'lucide-react'

type Mode = 'login' | 'register'

function passwordRules(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
}

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [showPass, setShowPass] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
  const [googleLoading, setGoogleLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setSuccess('')
    setShowPass(false)
    setPassword('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      if (mode === 'login') {
        const res = await loginUser(fd)
        if (res?.error) setError(res.error)
      } else {
        const rules = passwordRules(password)
        if (!rules.length || !rules.upper || !rules.special) {
          setError('La contraseña no cumple los requisitos.')
          return
        }
        const res = await registerUser(fd)
        if (res?.error) setError(res.error)
        if (res?.success) {
          setSuccess('Cuenta creada. Ahora inicia sesión.')
          switchMode('login')
        }
      }
    })
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { redirectTo: '/auth/completo' })
  }

  const rules = passwordRules(password)
  const showRules = mode === 'register' && password.length > 0

  const inputClass = `
    w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200
    bg-transparent border placeholder:opacity-40
  `

  return (
    <div className="space-y-5 w-full">

      {/* Minimalist tab switcher */}
      <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {(['login', 'register'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className="flex-1 pb-3 text-sm font-medium transition-all duration-200 relative"
            style={{ color: mode === m ? 'var(--foreground)' : 'rgba(255,255,255,0.35)' }}
          >
            {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            {mode === m && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input
            name="name"
            type="text"
            placeholder="Nombre completo"
            required
            className={inputClass}
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--foreground)' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className={inputClass}
          style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--foreground)' }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
        />

        <div className="relative">
          <input
            name="password"
            type={showPass ? 'text' : 'password'}
            placeholder="Contraseña"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`${inputClass} pr-10`}
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--foreground)' }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password requirements */}
        {showRules && (
          <div className="space-y-1 pt-0.5">
            {[
              { ok: rules.length,  label: 'Mínimo 8 caracteres' },
              { ok: rules.upper,   label: 'Una letra mayúscula' },
              { ok: rules.special, label: 'Un carácter especial (!@#$...)' },
            ].map(({ ok, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full transition-colors duration-200 shrink-0"
                  style={{ background: ok ? '#34d399' : 'rgba(255,255,255,0.2)' }}
                />
                <span
                  className="text-xs transition-colors duration-200"
                  style={{ color: ok ? '#34d399' : 'rgba(255,255,255,0.35)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {mode === 'login' && (
          <div className="flex items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <input type="checkbox" className="rounded" style={{ accentColor: 'var(--accent)' }} />
              Recordarme
            </label>
          </div>
        )}

        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-lg text-base font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          {isPending && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>o</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full h-12 flex items-center justify-center gap-3 rounded-lg text-base font-medium transition-all duration-200 disabled:opacity-60"
        style={{
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.04)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        }}
      >
        {googleLoading
          ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          : <svg width="18" height="18" viewBox="0 0 48 48"><path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/><path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/><path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/><path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/></svg>
        }
        Continuar con Google
      </button>
    </div>
  )
}
