import { useState, useEffect, useRef, useCallback } from 'react'

// In-memory cache: locationName → photoUrl
const photoCache = new Map()

/**
 * Lazily fetches a Google Places photo for a location.
 * Only triggers when `enabled` is true (controlled by IntersectionObserver externally).
 *
 * @param {string} locationName - The name of the location to search for
 * @param {boolean} enabled - Whether to start fetching (set true when in viewport)
 * @returns {{ photoUrl: string|null, isLoading: boolean, error: string|null }}
 */
export function usePlacesPhoto(locationName, enabled = false) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const fetchPhoto = useCallback(async () => {
    if (!locationName || !window.google?.maps?.places?.Place) return

    // Check photo cache first
    if (photoCache.has(locationName)) {
      setPhotoUrl(photoCache.get(locationName))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { Place } = window.google.maps.places;
      
      const request = {
        textQuery: `${locationName} Malta`,
        fields: ['id', 'photos'],
        maxResultCount: 1,
      };

      const { places } = await Place.searchByText(request);

      if (places && places.length > 0) {
        const place = places[0];
        if (place.photos && place.photos.length > 0) {
          // The new Places API uses getURI() instead of getUrl()
          const url = place.photos[0].getURI({ maxWidth: 800, maxHeight: 600 });
          if (mountedRef.current) {
            photoCache.set(locationName, url);
            setPhotoUrl(url);
          }
        } else {
          throw new Error('No photos found for this place');
        }
      } else {
        throw new Error('Place not found');
      }
    } catch (err) {
      if (mountedRef.current) {
        // No fallback — just no photo displayed
        setError(err.message)
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [locationName])

  useEffect(() => {
    if (enabled && !photoUrl && !isLoading) {
      fetchPhoto()
    }
  }, [enabled, fetchPhoto, photoUrl, isLoading])

  return { photoUrl, isLoading, error }
}
