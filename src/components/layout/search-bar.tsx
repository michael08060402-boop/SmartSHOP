'use client'

import { Search, X, TrendingUp } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSearchSuggestions } from '@/app/(shop)/buscar/suggestions-action'

type Suggestion = { id: string; name: string; price: number; images: string[]; category: string }

export function SearchBar() {
  const [focused, setFocused]         = useState(false)
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading]         = useState(false)
  const router    = useRouter()
  const inputRef  = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounced suggestions fetch
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return }
    setLoading(true)
    const t = setTimeout(async () => {
      const results = await getSearchSuggestions(query)
      setSuggestions(results)
      setLoading(false)
    }, 280)
    return () => clearTimeout(t)
  }, [query])

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`)
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  function handleSelect(id: string) {
    router.push(`/producto/${id}`)
    setFocused(false)
    setQuery('')
    setSuggestions([])
  }

  const showDropdown = focused && (query.trim().length >= 2)

  return (
    <div ref={wrapperRef} className="w-full max-w-lg relative">
      <form onSubmit={handleSubmit}>
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 z-10"
          style={{ color: focused ? '#3b82f6' : 'rgba(255,255,255,0.3)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar productos, marcas y categorías..."
          className="w-full h-11 pl-11 pr-9 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: focused ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.06)',
            border: `1.5px solid ${focused ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
            color: '#fff',
            boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.12)' : 'none',
          }}
          onFocus={() => setFocused(true)}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl overflow-hidden z-[200]"
          style={{
            background: 'rgba(10,15,28,0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          {loading && suggestions.length === 0 && (
            <div className="px-4 py-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Buscando...</span>
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="px-4 py-3 text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Sin resultados para "{query}"
            </div>
          )}

          {suggestions.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <TrendingUp size={10} /> RESULTADOS
                </p>
              </div>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left"
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    {s.images[0]
                      ? <img src={s.images[0]} alt={s.name} className="w-full h-full object-contain p-1" />
                      : <span className="text-lg">📦</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{s.name}</p>
                    <p className="text-[10px]" style={{ color: '#60a5fa' }}>{s.category}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: '#f97316' }}>
                    S/. {s.price.toLocaleString('es-PE')}
                  </span>
                </button>
              ))}

              {/* Ver todos */}
              <div className="px-4 py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <Search size={11} />
                  Ver todos los resultados para "{query}"
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
