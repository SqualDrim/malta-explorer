import { useState, useEffect, useRef } from 'react'

/**
 * Tracks the user's real-time GPS position using watchPosition.
 * Returns { position, error, isSupported, isTracking, startTracking, stopTracking }
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const watchIdRef = useRef(null)

  const isSupported = 'geolocation' in navigator

  const startTracking = () => {
    if (!isSupported) {
      setError('La géolocalisation n\'est pas supportée par ce navigateur.')
      return
    }

    setError(null)
    setIsTracking(true)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
        })
        setError(null)
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permission de géolocalisation refusée.')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Position indisponible.')
            break
          case err.TIMEOUT:
            setError('Délai de géolocalisation dépassé.')
            break
          default:
            setError('Erreur de géolocalisation inconnue.')
        }
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    setPosition(null)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return { position, error, isSupported, isTracking, startTracking, stopTracking }
}
