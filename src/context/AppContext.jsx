import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext(null)

// ─── Initial state ───────────────────────────────────────────────────────────
const initialState = {
  activeTab: 'map',
  filters: {
    island: 'All',
    difficulty: 'All',
    hiddenGem: false,
  },
  selectedLocation: null,   // location object clicked on map or card
  mapCenter: { lat: 35.9375, lng: 14.3754 },
  mapZoom: 11,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.payload },
      }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { island: 'All', difficulty: 'All', hiddenGem: false },
      }

    case 'SELECT_LOCATION':
      return { ...state, selectedLocation: action.payload }

    case 'SET_MAP_VIEW':
      return {
        ...state,
        mapCenter: action.payload.center,
        mapZoom: action.payload.zoom ?? state.mapZoom,
      }

    default:
      return state
  }
}

// ─── Lists helpers ────────────────────────────────────────────────────────────
function generateId() {
  return `list_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [lists, setLists] = useLocalStorage('malta_lists', [])

  // ── List CRUD ──────────────────────────────────────────────────────────────
  const createList = (name, emoji = '📍') => {
    const newList = {
      id: generateId(),
      name,
      emoji,
      createdAt: new Date().toISOString(),
      locationIds: [],
      visitedIds: [],
    }
    setLists((prev) => [...prev, newList])
    return newList.id
  }

  const deleteList = (listId) => {
    setLists((prev) => prev.filter((l) => l.id !== listId))
  }

  const renameList = (listId, name, emoji) => {
    setLists((prev) =>
      prev.map((l) => (l.id === listId ? { ...l, name, emoji } : l))
    )
  }

  const addLocationToList = (listId, locationId) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId && !l.locationIds.includes(locationId)
          ? { ...l, locationIds: [...l.locationIds, locationId] }
          : l
      )
    )
  }

  const removeLocationFromList = (listId, locationId) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? {
              ...l,
              locationIds: l.locationIds.filter((id) => id !== locationId),
              visitedIds: l.visitedIds.filter((id) => id !== locationId),
            }
          : l
      )
    )
  }

  const toggleVisited = (listId, locationId) => {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l
        const isVisited = l.visitedIds.includes(locationId)
        return {
          ...l,
          visitedIds: isVisited
            ? l.visitedIds.filter((id) => id !== locationId)
            : [...l.visitedIds, locationId],
        }
      })
    )
  }

  const isLocationInList = (listId, locationId) => {
    const list = lists.find((l) => l.id === listId)
    return list ? list.locationIds.includes(locationId) : false
  }

  const getListsContaining = (locationId) => {
    return lists.filter((l) => l.locationIds.includes(locationId))
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        lists,
        createList,
        deleteList,
        renameList,
        addLocationToList,
        removeLocationFromList,
        toggleVisited,
        isLocationInList,
        getListsContaining,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
