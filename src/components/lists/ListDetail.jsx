import React from 'react'
import { ArrowLeft, Star, Diamond, MapPin, Check, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const DIFFICULTY_STYLES = {
  Easy:     'badge-easy',
  Moderate: 'badge-moderate',
  Hard:     'badge-hard',
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`
        toggle-track w-11 h-6 flex-shrink-0
        ${checked ? 'bg-emerald-500' : 'bg-white/15'}
      `}
    >
      <span
        className={`toggle-thumb ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}

export default function ListDetail({ list, locations, onBack }) {
  const { toggleVisited, removeLocationFromList, dispatch } = useApp()

  const listLocations = list.locationIds
    .map((id) => locations.find((l) => l.id === id))
    .filter(Boolean)

  const visitedCount = list.visitedIds.length
  const totalCount = listLocations.length
  const progress = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0

  const handleFlyTo = (location) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location })
    dispatch({ type: 'SET_TAB', payload: 'map' })
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{list.emoji}</span>
            <h2 className="font-display font-bold text-white text-lg leading-tight">
              {list.name}
            </h2>
          </div>
        </div>

        {/* Progress section */}
        {totalCount > 0 && (
          <div className="glass rounded-2xl p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Progression</span>
              <span className={`font-bold text-sm ${progress === 100 ? 'text-emerald-400' : 'text-sea-400'}`}>
                {visitedCount}/{totalCount}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, #0694d6, #1eb3f5)',
                }}
              />
            </div>
            {progress === 100 && (
              <p className="text-emerald-400 text-xs font-semibold mt-2 flex items-center gap-1">
                <Check size={12} strokeWidth={3} />
                Liste complète ! Félicitations 🎉
              </p>
            )}
          </div>
        )}
      </div>

      {/* Location list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col gap-2">
        {listLocations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-white/40 font-medium text-sm">Cette liste est vide.</p>
            <p className="text-white/25 text-xs mt-1">Ajoutez des spots depuis le catalogue.</p>
          </div>
        )}

        {listLocations.map((loc) => {
          const isVisited = list.visitedIds.includes(loc.id)
          return (
            <div
              key={loc.id}
              className={`
                flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300
                ${isVisited
                  ? 'bg-white/3 border-white/5 opacity-60'
                  : 'glass border-white/10'
                }
              `}
            >
              {/* Visited indicator */}
              <div
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${isVisited ? 'bg-emerald-500/20' : 'bg-ocean-800'}
                `}
              >
                {isVisited
                  ? <Check size={15} className="text-emerald-400" strokeWidth={3} />
                  : <span className="text-sm">{loc.hiddenGem ? '💎' : '📍'}</span>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate transition-all ${isVisited ? 'line-through text-white/40' : 'text-white'}`}>
                  {loc.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[loc.difficulty] || ''}`}>
                    {loc.difficulty}
                  </span>
                  <span className="text-white/30 text-[10px]">{loc.island}</span>
                  <span className="text-white/20 text-[10px]">·</span>
                  <Star size={9} className="text-sand-400 fill-sand-400" />
                  <span className="text-sand-400 text-[10px] font-semibold">{loc.rating}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Fly to map */}
                <button
                  onClick={() => handleFlyTo(loc)}
                  className="text-white/25 hover:text-sea-400 transition-colors p-1.5 rounded-lg hover:bg-sea-500/10"
                  title="Voir sur la carte"
                >
                  <MapPin size={14} />
                </button>

                {/* Remove from list */}
                <button
                  onClick={() => removeLocationFromList(list.id, loc.id)}
                  className="text-white/25 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                  title="Retirer de la liste"
                >
                  <Trash2 size={14} />
                </button>

                {/* Toggle visited */}
                <ToggleSwitch
                  checked={isVisited}
                  onChange={() => toggleVisited(list.id, loc.id)}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
