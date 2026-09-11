import React from 'react'
import { OverlayView } from '@react-google-maps/api'

const DIFFICULTY_COLORS = {
  Easy:     { bg: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  Moderate: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  Hard:     { bg: '#ef4444', glow: 'rgba(239,68,68,0.5)'  },
}

export default function CustomMarker({ location, isActive, onClick }) {
  const colors = DIFFICULTY_COLORS[location.difficulty] || DIFFICULTY_COLORS.Easy
  const isGem = location.hiddenGem

  const size = isActive ? 40 : 32
  const innerSize = isActive ? 16 : 12

  return (
    <OverlayView
      position={{ lat: location.lat, lng: location.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
    >
      <div
        onClick={(e) => { e.stopPropagation(); onClick() }}
        style={{ width: size, height: size, cursor: 'pointer' }}
        className="relative flex items-center justify-center"
        title={location.name}
      >
        {/* Outer glow ring (active or gem) */}
        {(isActive || isGem) && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: isGem ? 'rgba(168,85,247,0.3)' : colors.glow,
              animationDuration: '2s',
            }}
          />
        )}

        {/* Main circle */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/80 shadow-lg transition-transform duration-200"
          style={{
            backgroundColor: isGem ? '#9b59b6' : colors.bg,
            boxShadow: `0 0 ${isActive ? 16 : 8}px ${isGem ? 'rgba(155,89,182,0.6)' : colors.glow}`,
            transform: isActive ? 'scale(1.15)' : 'scale(1)',
          }}
        />

        {/* Inner icon */}
        <div
          className="relative z-10"
          style={{ width: innerSize, height: innerSize }}
        >
          {isGem ? (
            // Diamond for hidden gems
            <svg viewBox="0 0 24 24" fill="white" width={innerSize} height={innerSize}>
              <path d="M12 2L2 9l10 13L22 9z" />
            </svg>
          ) : (
            // Pin dot for regular spots
            <div
              className="w-full h-full rounded-full bg-white/90"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            />
          )}
        </div>
      </div>
    </OverlayView>
  )
}
