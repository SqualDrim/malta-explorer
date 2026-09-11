import React, { useState } from 'react'
import { Star, Diamond, BookMarked, X, Compass } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AddToListModal from '../lists/AddToListModal'

const DIFFICULTY_STYLES = {
  Easy:     'badge-easy',
  Moderate: 'badge-moderate',
  Hard:     'badge-hard',
}
const ISLAND_STYLES = {
  Malta:   'badge-malta',
  Gozo:    'badge-gozo',
  Comino:  'badge-comino',
}

export default function LocationInfoWindow({ location, onClose }) {
  const { dispatch } = useApp()
  const [showAddToList, setShowAddToList] = useState(false)

  return (
    <>
      <div className="w-72 p-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="font-display font-bold text-white text-sm leading-tight">
              {location.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star size={11} className="text-sand-300 fill-sand-300" />
              <span className="text-sand-300 text-xs font-semibold">{location.rating}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors mt-0.5 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ISLAND_STYLES[location.island] || ''}`}>
            {location.island}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[location.difficulty] || ''}`}>
            {location.difficulty}
          </span>
          {location.hiddenGem && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 bg-gem-600/20 text-gem-400 border border-gem-500/30">
              <Diamond size={9} />
              Hidden Gem
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              dispatch({ type: 'SELECT_LOCATION', payload: location })
              dispatch({ type: 'SET_TAB', payload: 'explore' })
              onClose()
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-ocean-800/60 hover:bg-ocean-700/60 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all duration-200"
          >
            <Compass size={13} />
            Explorer
          </button>
          <button
            onClick={() => setShowAddToList(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sea-600/30 hover:bg-sea-600/50 border border-sea-500/30 text-sea-300 text-xs font-semibold transition-all duration-200"
          >
            <BookMarked size={13} />
            + Liste
          </button>
        </div>
      </div>

      {showAddToList && (
        <AddToListModal
          location={location}
          onClose={() => setShowAddToList(false)}
        />
      )}
    </>
  )
}
