import React from 'react'
import { Trash2, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ListCard({ list, onClick, onDelete }) {
  const progress = list.locationIds.length > 0
    ? Math.round((list.visitedIds.length / list.locationIds.length) * 100)
    : 0

  return (
    <div
      className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group hover:scale-[1.01] animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div className="w-12 h-12 rounded-2xl bg-ocean-800 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
          {list.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-bold text-white text-sm truncate">
              {list.name}
            </h3>
            <ChevronRight size={16} className="text-white/30 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <p className="text-white/40 text-xs mt-0.5">
            {list.locationIds.length} lieu{list.locationIds.length > 1 ? 'x' : ''} · {list.visitedIds.length} visité{list.visitedIds.length > 1 ? 's' : ''}
          </p>

          {/* Progress bar */}
          {list.locationIds.length > 0 && (
            <div className="mt-2.5">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: progress === 100
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : 'linear-gradient(90deg, #0694d6, #1eb3f5)',
                  }}
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1 font-medium">
                {progress}% explorée
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
