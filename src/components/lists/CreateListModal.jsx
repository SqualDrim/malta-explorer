import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const EMOJIS = ['📍', '🤿', '🚗', '🏖️', '🧗', '⛵', '🌅', '🏛️', '🍽️', '🌿', '📸', '❤️']

export default function CreateListModal({ onClose, onCreated }) {
  const { createList } = useApp()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📍')

  const handleCreate = () => {
    if (!name.trim()) return
    const id = createList(name.trim(), emoji)
    onCreated?.(id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-sm glass-dark rounded-3xl p-5 animate-slide-up border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-base">Nouvelle liste</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Emoji picker */}
        <p className="text-xs text-white/40 font-medium mb-2">Choisir une icône</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`
                flex-shrink-0 w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200
                ${emoji === e ? 'bg-sea-600/40 scale-110 ring-1 ring-sea-400 shadow-md' : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Name input */}
        <p className="text-xs text-white/40 font-medium mb-2">Nom de la liste</p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Ex: Roadtrip, Plongée, Weekend…"
          maxLength={40}
          className="w-full bg-ocean-900/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-sea-500/60 transition-colors mb-4"
        />

        {/* Preview */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
          <span className="text-2xl">{emoji}</span>
          <span className="text-white font-medium text-sm flex-1 truncate">
            {name || 'Ma nouvelle liste'}
          </span>
          <span className="text-white/30 text-xs">0 lieu</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/15 text-white/50 hover:text-white hover:border-white/30 text-sm font-medium transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 py-3 rounded-xl bg-sea-600 hover:bg-sea-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-200 shadow-lg"
          >
            Créer la liste
          </button>
        </div>
      </div>
    </div>
  )
}
