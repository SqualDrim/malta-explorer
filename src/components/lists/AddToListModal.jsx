import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const EMOJIS = ['📍', '🤿', '🚗', '🏖️', '🧗', '⛵', '🌅', '🏛️', '🍽️', '🌿', '📸', '❤️']

export default function AddToListModal({ location, onClose }) {
  const { lists, createList, addLocationToList, removeLocationFromList, isLocationInList } = useApp()
  const [newListName, setNewListName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('📍')
  const [showCreate, setShowCreate] = useState(false)

  const handleToggleList = (listId) => {
    if (isLocationInList(listId, location.id)) {
      removeLocationFromList(listId, location.id)
    } else {
      addLocationToList(listId, location.id)
    }
  }

  const handleCreateAndAdd = () => {
    if (!newListName.trim()) return
    const listId = createList(newListName.trim(), selectedEmoji)
    addLocationToList(listId, location.id)
    setNewListName('')
    setShowCreate(false)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm glass-dark rounded-3xl p-5 animate-slide-up border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-white text-base">Ajouter à une liste</h2>
            <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{location.name}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Existing lists */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto mb-4">
          {lists.length === 0 && !showCreate && (
            <p className="text-white/30 text-sm text-center py-4">Aucune liste créée.</p>
          )}
          {lists.map((list) => {
            const inList = isLocationInList(list.id, location.id)
            return (
              <button
                key={list.id}
                onClick={() => handleToggleList(list.id)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                  ${inList
                    ? 'bg-sea-700/30 border-sea-500/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }
                `}
              >
                <span className="text-lg">{list.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{list.name}</p>
                  <p className="text-[11px] text-white/40">{list.locationIds.length} lieu{list.locationIds.length > 1 ? 'x' : ''}</p>
                </div>
                {inList && (
                  <div className="w-5 h-5 rounded-full bg-sea-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Create new list */}
        {showCreate ? (
          <div className="flex flex-col gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            {/* Emoji picker */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all
                    ${selectedEmoji === emoji ? 'bg-sea-600/40 scale-110 ring-1 ring-sea-400' : 'bg-white/5 hover:bg-white/10'}
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
                placeholder="Nom de la liste..."
                maxLength={40}
                className="flex-1 bg-ocean-900/60 border border-white/20 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-sea-500/60 transition-colors"
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={!newListName.trim()}
                className="px-4 py-2 rounded-xl bg-sea-600 hover:bg-sea-500 disabled:opacity-30 text-white text-sm font-semibold transition-all"
              >
                Créer
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/30 text-sm font-medium transition-all duration-200"
          >
            + Nouvelle liste
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}
