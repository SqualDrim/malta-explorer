import React from 'react'
import { Diamond, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ISLANDS = ['All', 'Malta', 'Gozo', 'Comino']
const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Hard']

const ISLAND_COLORS = {
  All: 'text-white/60 border-white/20 bg-white/5',
  Malta: 'text-sea-300 border-sea-600/50 bg-sea-800/30',
  Gozo: 'text-emerald-300 border-emerald-700/50 bg-emerald-900/30',
  Comino: 'text-coral-400 border-coral-600/40 bg-coral-600/10',
}

const DIFFICULTY_COLORS = {
  All: 'text-white/60 border-white/20 bg-white/5',
  Easy: 'text-emerald-400 border-emerald-600/40 bg-emerald-900/20',
  Moderate: 'text-amber-400 border-amber-600/40 bg-amber-900/20',
  Hard: 'text-red-400 border-red-600/40 bg-red-900/20',
}

function Chip({ label, isActive, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium
        transition-all duration-200 whitespace-nowrap
        ${color}
        ${isActive ? 'ring-1 ring-offset-1 ring-offset-ocean-900 ring-current shadow-md scale-105' : 'opacity-60 hover:opacity-90'}
      `}
    >
      {label}
    </button>
  )
}

export default function FilterBar({ className = '' }) {
  const { state, dispatch } = useApp()
  const { filters } = state

  const setFilter = (key, value) => dispatch({ type: 'SET_FILTER', key, payload: value })

  const activeCount =
    (filters.island !== 'All' ? 1 : 0) +
    (filters.difficulty !== 'All' ? 1 : 0) +
    (filters.hiddenGem ? 1 : 0)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Row 1: Islands */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4"
        style={{ padding: "10px" }}>
        <span className="flex-shrink-0 text-[10px] text-white/30 font-semibold uppercase tracking-widest self-center">Île</span>
        {ISLANDS.map((island) => (
          <Chip
            key={island}
            label={island === 'All' ? 'Toutes' : island}
            isActive={filters.island === island}
            color={ISLAND_COLORS[island]}
            onClick={() => setFilter('island', island)}
          />
        ))}
      </div>

      {/* Row 2: Difficulty + Hidden Gem */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1"
        style={{ padding: "10px" }}
      >
        <span className="flex-shrink-0 text-[10px] text-white/30 font-semibold uppercase tracking-widest self-center">Difficulté</span>
        {DIFFICULTIES.map((diff) => (
          <Chip
            key={diff}
            label={diff === 'All' ? 'Toutes' : diff}
            isActive={filters.difficulty === diff}
            color={DIFFICULTY_COLORS[diff]}
            onClick={() => setFilter('difficulty', diff)}
          />
        ))}
        <div className="w-px bg-white/10 mx-1 self-stretch" />
        {/* Hidden Gem toggle chip */}
        <button
          onClick={() => setFilter('hiddenGem', !filters.hiddenGem)}
          className={`
            flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium
            transition-all duration-200 whitespace-nowrap
            ${filters.hiddenGem
              ? 'text-gem-400 border-gem-500/50 bg-gem-600/15 ring-1 ring-gem-500/40 scale-105'
              : 'text-white/50 border-white/15 bg-white/5 opacity-60 hover:opacity-90'
            }
          `}
        >
          <Diamond size={11} />
          Hidden Gem
        </button>
      </div>

      {/* Active filter count badge */}
      {activeCount > 0 && (
        <div className="px-4">
          <button
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            className="text-[11px] text-sea-400 hover:text-sea-300 underline underline-offset-2 transition-colors"
          >
            Effacer les filtres ({activeCount})
          </button>
        </div>
      )}
    </div>
  )
}
