'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'

const LIMA: [number, number] = [-12.0464, -77.0428]

export interface MapData {
  address: string
  lat: number
  lng: number
}

interface Props {
  defaultLat?: number | null
  defaultLng?: number | null
  defaultAddress?: string | null
  onChange: (data: MapData) => void
}

export function MapPicker({ defaultLat, defaultLng, defaultAddress, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const markerRef    = useRef<any>(null)

  const [address,   setAddress]   = useState(defaultAddress ?? '')
  const [query,     setQuery]     = useState('')
  const [results,   setResults]   = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [reversing, setReversing] = useState(false)

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setReversing(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'es', 'User-Agent': 'SmartSHOP/1.0' } }
      )
      const data = await res.json()
      const addr = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(addr)
      onChange({ address: addr, lat, lng })
    } catch {
      const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(addr)
      onChange({ address: addr, lat, lng })
    } finally {
      setReversing(false)
    }
  }, [onChange])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const center: [number, number] = (defaultLat && defaultLng) ? [defaultLat, defaultLng] : LIMA
    const zoom = (defaultLat && defaultLng) ? 16 : 13

    import('leaflet').then(({ default: L }) => {
      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { center, zoom })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        html: `<div style="width:28px;height:40px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5))"><svg viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26s14-16.667 14-26C28 6.268 21.732 0 14 0z" fill="#f97316"/><circle cx="14" cy="14" r="6" fill="white"/></svg></div>`,
        className: '',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
      })

      const marker = L.marker(center, { draggable: true, icon }).addTo(map)

      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng()
        reverseGeocode(lat, lng)
      })

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        reverseGeocode(e.latlng.lat, e.latlng.lng)
      })

      mapRef.current   = map
      markerRef.current = marker

      if (defaultLat && defaultLng && defaultAddress) {
        onChange({ address: defaultAddress, lat: defaultLat, lng: defaultLng })
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current    = null
        markerRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function search() {
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setResults([])
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=pe`,
        { headers: { 'Accept-Language': 'es', 'User-Agent': 'SmartSHOP/1.0' } }
      )
      const data = await res.json()
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }

  function selectResult(r: any) {
    const lat  = parseFloat(r.lat)
    const lng  = parseFloat(r.lon)
    const addr = r.display_name as string

    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      mapRef.current.setView([lat, lng], 17, { animate: true })
    }

    setAddress(addr)
    setResults([])
    setQuery('')
    onChange({ address: addr, lat, lng })
  }

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    color: '#fff',
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <div className="space-y-3">

      {/* Search */}
      <div className="relative">
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); search() } }}
            placeholder="Buscar dirección en Lima..."
            style={{ ...inputBase, flex: 1 }}
          />
          <button
            type="button"
            onClick={search}
            disabled={searching || !query.trim()}
            style={{
              background: 'linear-gradient(90deg,#ea580c,#f97316)',
              borderRadius: 12,
              padding: '10px 16px',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              opacity: !query.trim() ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>

        {/* Dropdown results */}
        {results.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0, right: 0,
            zIndex: 9999,
            background: '#18191c',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{results.length} resultados</span>
              <button type="button" onClick={() => setResults([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex' }}>
                <X size={12} />
              </button>
            </div>
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectResult(r)}
                style={{
                  width: '100%', padding: '9px 12px', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  color: 'rgba(255,255,255,0.8)', fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <MapPin size={11} style={{ color: '#f97316', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div ref={containerRef} style={{ height: 280, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }} />

      {/* Selected address */}
      {(address || reversing) && (
        <div style={{
          background: 'rgba(249,115,22,0.07)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 12, padding: '9px 13px',
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          {reversing
            ? <Loader2 size={13} style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }} className="animate-spin" />
            : <MapPin size={13} style={{ color: '#f97316', flexShrink: 0, marginTop: 2 }} />}
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
            {reversing ? 'Obteniendo direccion...' : address}
          </p>
        </div>
      )}

      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
        Busca tu direccion o haz clic en el mapa para mover el pin
      </p>
    </div>
  )
}
