import React, { useRef, useState, useEffect } from 'react'
import { Star, Diamond, BookMarked, MapPin, Loader2 } from 'lucide-react'
import { usePlacesPhoto } from '../../hooks/usePlacesPhoto'
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

export default function LocationCard({ location }) {
  const { state, dispatch, getListsContaining } = useApp()
  const { selectedLocation, activeTab } = state
  const [isVisible, setIsVisible] = useState(false)
  const [showAddToList, setShowAddToList] = useState(false)
  const cardRef = useRef(null)

  // Scroll into view when selected from Map and switching to Explore
  useEffect(() => {
    if (activeTab === 'explore' && selectedLocation?.id === location.id && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [activeTab, selectedLocation, location.id])

  // IntersectionObserver for lazy photo loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const { photoUrl, isLoading } = usePlacesPhoto(location.name, isVisible)

  const listsCount = getListsContaining(location.id).length

  const handleFlyTo = () => {
    dispatch({ type: 'SELECT_LOCATION', payload: location })
    dispatch({ type: 'SET_TAB', payload: 'map' })
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative flex flex-col rounded-2xl overflow-hidden glass border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in group"
        style={{ minHeight: 220 }}
      >
        {/* Photo area */}
        <div className="relative h-36 bg-ocean-800 flex-shrink-0 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={20} className="text-sea-400 animate-spin" />
            </div>
          )}

          {photoUrl && (
            <img
              src={photoUrl}
              alt={location.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-card" />

          {/* Hidden Gem badge overlay */}
          {location.hiddenGem && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-gem-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              <Diamond size={9} />
              Hidden Gem
            </div>
          )}

          {/* Lists count badge */}
          {listsCount > 0 && (
            <div className="absolute top-2 right-2 bg-sea-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
              {listsCount} liste{listsCount > 1 ? 's' : ''}
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 glass rounded-full px-2 py-0.5">
            <Star size={10} className="text-sand-300 fill-sand-300" />
            <span className="text-sand-300 text-[11px] font-bold">{location.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-3 flex-1">
          <h3 className="font-display font-semibold text-white text-sm leading-tight line-clamp-2">
            {location.name}
          </h3>

          <div className="flex flex-wrap gap-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ISLAND_STYLES[location.island] || ''}`}>
              {location.island}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[location.difficulty] || ''}`}>
              {location.difficulty}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 mt-auto">
            <button
              onClick={handleFlyTo}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-ocean-800/60 hover:bg-ocean-700/60 border border-white/10 text-white/60 hover:text-white text-[11px] font-medium transition-all duration-200 flex-1 justify-center"
            >
              <MapPin size={11} />
              Voir sur carte
            </button>
            <button
              onClick={() => setShowAddToList(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sea-700/30 hover:bg-sea-600/40 border border-sea-600/30 text-sea-300 text-[11px] font-medium transition-all duration-200 flex-1 justify-center"
            >
              <BookMarked size={11} />
              + Liste
            </button>
          </div>
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
