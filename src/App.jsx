import React, { Suspense } from 'react'
import { LoadScript } from '@react-google-maps/api'
import { AppProvider, useApp } from './context/AppContext'
import BottomNav from './components/layout/BottomNav'
import MapPage from './pages/MapPage'
import ExplorePage from './pages/ExplorePage'
import ListsPage from './pages/ListsPage'
import locationsData from './assets/locations.json'

// IMPORTANT: declare outside component to prevent re-creation on every render
const GOOGLE_MAPS_LIBRARIES = ['places']

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--ocean-900)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1rem',
    }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '4px solid rgba(11,110,155,0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          borderTop: '4px solid var(--sea-400)',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48ceff" strokeWidth="2">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1.125rem' }}>
          Malta Explorer
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>
          Chargement de la carte…
        </p>
      </div>
    </div>
  )
}

function AppShell() {
  const { state } = useApp()
  const { activeTab } = state
  const navHeight = 64

  return (
    <div className="app-shell">
      {/* Page content */}
      <div className="page-container" style={{ paddingBottom: navHeight }}>
        {/* Map is always mounted to preserve map state */}
        <div className={`page-slide ${activeTab === 'map' ? 'active' : 'inactive'}`}>
          <MapPage locations={locationsData} />
        </div>

        <div className={`page-slide ${activeTab === 'explore' ? 'active' : 'inactive'}`}>
          <ExplorePage locations={locationsData} />
        </div>

        <div className={`page-slide ${activeTab === 'lists' ? 'active' : 'inactive'}`}>
          <ListsPage locations={locationsData} />
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}

function MissingKeyScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--ocean-900)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 24,
        padding: '2rem',
        maxWidth: 380,
        width: '100%',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔑</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
          Clé API manquante
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Ajoutez votre clé Google Maps dans le fichier{' '}
          <code style={{ color: 'var(--amber-400)', background: 'rgba(245,158,11,0.1)', padding: '0 4px', borderRadius: 4 }}>.env</code> :
        </p>
        <pre style={{
          marginTop: '0.75rem', padding: '0.75rem',
          borderRadius: 12, background: 'var(--ocean-800)',
          textAlign: 'left', fontSize: '0.75rem',
          color: '#34d399', fontFamily: 'monospace', overflowX: 'auto',
        }}>
          VITE_GOOGLE_MAPS_API_KEY=votre_cle
        </pre>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
          Puis redémarrez le serveur de développement.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'VOTRE_CLE_API_ICI') {
    return <MissingKeyScreen />
  }

  return (
    <AppProvider>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={GOOGLE_MAPS_LIBRARIES}
        loadingElement={<LoadingScreen />}
        language="fr"
        region="MT"
      >
        <AppShell />
      </LoadScript>
    </AppProvider>
  )
}
