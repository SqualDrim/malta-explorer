import React, { useMemo, useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import LocationCard from './LocationCard'
import { useApp } from '../../context/AppContext'

function applyFilters(locations, filters) {
  return locations.filter((loc) => {
    if (filters.island !== 'All' && loc.island !== filters.island) return false
    if (filters.difficulty !== 'All' && loc.difficulty !== filters.difficulty) return false
    if (filters.hiddenGem && !loc.hiddenGem) return false
    return true
  })
}

export default function CatalogView({ locations }) {
  const { state } = useApp()
  const { filters, activeTab } = state

  // Force a re-render once when the explore tab becomes active,
  // so the filtered list renders correctly after being hidden at startup.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (activeTab === 'explore') setReady(true)
  }, [activeTab])

  const filtered = useMemo(
    () => applyFilters(locations, filters),
    [locations, filters, ready]
  )

  if (!ready) return null

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-ocean-800 flex items-center justify-center mb-4">
          <Search size={28} className="text-white/20" />
        </div>
        <p className="text-white/40 font-medium">Aucun lieu ne correspond à vos filtres.</p>
        <p className="text-white/25 text-sm mt-1">Essayez de modifier les filtres ci-dessus.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24">
      {/* Count */}
      <p className="text-xs text-white/30 font-medium mb-3">
        {filtered.length} spot{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((loc) => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    </div>
  )
}
