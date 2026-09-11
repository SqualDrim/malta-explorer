import React from 'react'
import { Anchor } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Header({ title, subtitle, actions }) {
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-3 safe-top">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sea-500 to-sea-700 flex items-center justify-center shadow-lg glow-sea">
          <Anchor size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-white leading-tight">
            {title || 'Malta Explorer'}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-white/40 font-medium leading-none mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  )
}
