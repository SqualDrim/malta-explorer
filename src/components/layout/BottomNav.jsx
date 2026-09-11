import React from 'react'
import { Map, Compass, BookMarked } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const TABS = [
  { id: 'map',     label: 'Carte',    Icon: Map },
  { id: 'explore', label: 'Explorer', Icon: Compass },
  { id: 'lists',   label: 'Listes',   Icon: BookMarked },
]

export default function BottomNav() {
  const { state, dispatch } = useApp()
  const { activeTab } = state

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_TAB', payload: id })}
              className="nav-item"
              style={{
                color: isActive ? 'var(--sea-400)' : 'rgba(255,255,255,0.35)',
                position: 'relative',
              }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top line */}
              {isActive && (
                <span style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 32, height: 2, background: 'var(--sea-400)', borderRadius: 99,
                }} />
              )}

              {/* Active background */}
              {isActive && (
                <span style={{
                  position: 'absolute', inset: '4px 8px',
                  background: 'rgba(6,148,214,0.12)', borderRadius: 12,
                }} />
              )}

              <span style={{ position: 'relative', zIndex: 1 }}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
              </span>
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.05em', position: 'relative', zIndex: 1,
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
