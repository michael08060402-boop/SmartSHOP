'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  height?: number
}

export function MapView({ lat, lng, height = 160 }: Props) {
  const ref    = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(({ default: L }) => {
      if (!ref.current || mapRef.current) return

      const map = L.map(ref.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        attributionControl: false,
        keyboard: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map)

      const icon = L.divIcon({
        html: `<div style="width:22px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))"><svg viewBox="0 0 28 40" fill="none"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 26 14 26s14-16.667 14-26C28 6.268 21.732 0 14 0z" fill="#f97316"/><circle cx="14" cy="14" r="6" fill="white"/></svg></div>`,
        className: '',
        iconSize: [22, 32],
        iconAnchor: [11, 32],
      })

      L.marker([lat, lng], { icon }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng])

  return (
    <div
      ref={ref}
      style={{
        height,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        pointerEvents: 'none',
      }}
    />
  )
}
