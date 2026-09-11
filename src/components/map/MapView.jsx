import React, { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, OverlayView, InfoWindow } from '@react-google-maps/api'
import { useApp } from '../../context/AppContext'
import { useGeolocation } from '../../hooks/useGeolocation'
import CustomMarker from './CustomMarker'
import UserMarker from './UserMarker'
import LocationInfoWindow from './LocationInfoWindow'

// Malta center + bounds (includes Gozo, Comino)
const MALTA_CENTER = { lat: 35.9375, lng: 14.3754 }
const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
  clickableIcons: false,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3e8' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b3d6b' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a9fc8' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#162d58' }] },
    { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#0f2040' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e3a5c' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0a1e3c' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1a4a7a' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e4080' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#7ab4d8' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#7ab4d8' }] },
  ],
}

function applyFilters(locations, filters) {
  return locations.filter((loc) => {
    if (filters.island !== 'All' && loc.island !== filters.island) return false
    if (filters.difficulty !== 'All' && loc.difficulty !== filters.difficulty) return false
    if (filters.hiddenGem && !loc.hiddenGem) return false
    return true
  })
}

export default function MapView({ locations }) {
  const { state, dispatch } = useApp()
  const { filters, mapCenter, mapZoom, selectedLocation } = state
  const { position, isTracking, startTracking, stopTracking } = useGeolocation()
  const mapRef = useRef(null)
  const [activeMarker, setActiveMarker] = useState(null)
  // mapReady becomes true once Google Maps fires its first 'idle' event,
  // guaranteeing the map container is visible and OverlayViews can position correctly.
  const [mapReady, setMapReady] = useState(false)

  const filteredLocations = applyFilters(locations, filters)

  const onLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const onIdle = useCallback(() => {
    setMapReady(true)
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  // When a location is selected from catalog/list, fly to it
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng })
      mapRef.current.setZoom(15)
      setActiveMarker(selectedLocation)
    }
  }, [selectedLocation])

  // Pan to user position
  const handleLocateMe = () => {
    if (!isTracking) {
      startTracking()
    } else if (position && mapRef.current) {
      mapRef.current.panTo(position)
      mapRef.current.setZoom(14)
    } else {
      stopTracking()
    }
  }

  useEffect(() => {
    if (position && mapRef.current && isTracking) {
      mapRef.current.panTo(position)
    }
  }, [position, isTracking])

  const handleMarkerClick = (location) => {
    setActiveMarker(location)
    dispatch({ type: 'SELECT_LOCATION', payload: location })
    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng })
    }
  }

  const handleMapClick = () => {
    setActiveMarker(null)
    dispatch({ type: 'SELECT_LOCATION', payload: null })
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={MALTA_CENTER}
        zoom={11}
        options={MAP_OPTIONS}
        onLoad={onLoad}
        onIdle={onIdle}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {/* Location markers — rendered only once the map is idle & visible */}
        {mapReady && filteredLocations.map((loc) => (
          <CustomMarker
            key={loc.id}
            location={loc}
            isActive={activeMarker?.id === loc.id}
            onClick={() => handleMarkerClick(loc)}
          />
        ))}

        {/* User position marker */}
        {position && <UserMarker position={position} />}

        {/* Info window on active marker */}
        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarker(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
          >
            <LocationInfoWindow
              location={activeMarker}
              onClose={() => setActiveMarker(null)}
            />
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Locate Me button */}
      <button
        onClick={handleLocateMe}
        className={`
          absolute bottom-4 right-4 w-12 h-12 rounded-2xl shadow-xl
          flex items-center justify-center transition-all duration-300
          ${isTracking
            ? 'bg-sea-500 text-white glow-sea scale-105'
            : 'glass text-white/70 hover:text-white hover:bg-white/10'
          }
        `}
        title={isTracking ? 'Centrer sur ma position' : 'Me localiser'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      </button>

      {/* Map stats chip */}
      <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs text-white/60 font-medium">
        {filteredLocations.length} spot{filteredLocations.length > 1 ? 's' : ''}
      </div>
    </div>
  )
}
