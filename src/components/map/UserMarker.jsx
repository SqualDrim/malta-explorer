import React from 'react'
import { OverlayView } from '@react-google-maps/api'

export default function UserMarker({ position }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
    >
      <div className="relative w-8 h-8 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
        {/* Outer ripple ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: 'rgba(30, 179, 245, 0.2)',
            animation: 'ripple 2s ease-out infinite',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-1.5 rounded-full"
          style={{
            backgroundColor: 'rgba(30, 179, 245, 0.15)',
            animation: 'ripple 2s ease-out infinite 0.5s',
          }}
        />
        {/* Core dot */}
        <div
          className="relative w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{
            backgroundColor: '#1eb3f5',
            boxShadow: '0 0 12px rgba(30,179,245,0.8), 0 2px 6px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </OverlayView>
  )
}
