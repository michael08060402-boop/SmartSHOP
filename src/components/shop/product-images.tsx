'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

interface Props {
  images: string[]
  name: string
}

export function ProductImages({ images, name }: Props) {
  const [selected, setSelected] = useState(0)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})

  const main = images[selected]

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: '1',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {main && !imgError[selected] ? (
          <img
            src={main}
            alt={name}
            className="w-full h-full object-contain p-6"
            onError={() => setImgError(prev => ({ ...prev, [selected]: true }))}
          />
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: 'rgba(255,255,255,0.15)' }}>
            <ImageIcon size={48} />
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: `2px solid ${selected === i ? '#f97316' : 'rgba(255,255,255,0.08)'}`,
                background: 'rgba(255,255,255,0.04)',
                opacity: selected === i ? 1 : 0.6,
              }}
            >
              {!imgError[i] ? (
                <img
                  src={img}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-contain p-1"
                  onError={() => setImgError(prev => ({ ...prev, [i]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
