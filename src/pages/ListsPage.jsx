import React, { useState } from 'react'
import { Plus, BookMarked } from 'lucide-react'
import Header from '../components/layout/Header'
import ListCard from '../components/lists/ListCard'
import ListDetail from '../components/lists/ListDetail'
import CreateListModal from '../components/lists/CreateListModal'
import { useApp } from '../context/AppContext'

export default function ListsPage({ locations }) {
  const { lists, deleteList } = useApp()
  const [activeListId, setActiveListId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const activeList = lists.find((l) => l.id === activeListId)

  if (activeList) {
    return (
      <div className="flex flex-col h-full">
        <ListDetail
          list={activeList}
          locations={locations}
          onBack={() => setActiveListId(null)}
        />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-ocean-900/95 backdrop-blur-sm border-b border-white/5">
          <Header
            title="Mes Listes"
            subtitle={`${lists.length} liste${lists.length > 1 ? 's' : ''} personnalisée${lists.length > 1 ? 's' : ''}`}
            actions={
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sea-600 hover:bg-sea-500 text-white text-xs font-semibold transition-all duration-200 shadow-lg"
              >
                <Plus size={14} />
                Nouvelle
              </button>
            }
          />
        </div>

        {/* List of lists */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-3">
          {lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-ocean-800 flex items-center justify-center mb-5 shadow-xl">
                <BookMarked size={32} className="text-white/20" />
              </div>
              <h3 className="font-display font-bold text-white text-base mb-2">
                Aucune liste pour l'instant
              </h3>
              <p className="text-white/35 text-sm max-w-[200px] leading-relaxed">
                Créez votre première liste pour organiser vos spots maltais.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-sea-600 hover:bg-sea-500 text-white text-sm font-bold transition-all duration-200 shadow-lg glow-sea"
              >
                <Plus size={16} />
                Créer une liste
              </button>
            </div>
          ) : (
            <>
              {/* Stats banner */}
              <div className="glass rounded-2xl p-4 border border-white/10 mb-1">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-display font-bold text-white text-xl">{lists.length}</p>
                    <p className="text-white/40 text-[10px]">Liste{lists.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="font-display font-bold text-white text-xl">
                      {lists.reduce((acc, l) => acc + l.locationIds.length, 0)}
                    </p>
                    <p className="text-white/40 text-[10px]">Spots planifiés</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="font-display font-bold text-emerald-400 text-xl">
                      {lists.reduce((acc, l) => acc + l.visitedIds.length, 0)}
                    </p>
                    <p className="text-white/40 text-[10px]">Déjà visités</p>
                  </div>
                </div>
              </div>

              {lists.map((list) => (
                <div key={list.id} className="relative">
                  <ListCard
                    list={list}
                    onClick={() => setActiveListId(list.id)}
                    onDelete={() => deleteList(list.id)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {showCreate && (
        <CreateListModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => setActiveListId(id)}
        />
      )}
    </>
  )
}
