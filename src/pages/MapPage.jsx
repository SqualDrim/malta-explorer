import React from 'react'
import MapView from '../components/map/MapView'
import FilterBar from '../components/filters/FilterBar'
import { useApp } from '../context/AppContext'

export default function MapPage({ locations }) {
  const { state } = useApp()

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Filter overlay on top of map */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-3 pb-2 bg-gradient-to-b from-ocean-900/95 via-ocean-900/70 to-transparent pointer-events-none">
        {/* Title */}
        <div className="px-4 mb-3 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sea-500 to-sea-700 flex items-center justify-center shadow-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-sm text-white leading-none">Malta Explorer</h1>
              <p className="text-[10px] text-white/40 mt-0.5">Archipel maltais</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-auto">
          <FilterBar />
        </div>
      </div>

      {/* Map fills the entire page */}
      <div className="flex-1">
        <MapView locations={locations} />
      </div>
    </div>
  )
}
