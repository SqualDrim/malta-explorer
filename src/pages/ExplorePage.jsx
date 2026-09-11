import React from 'react'
import Header from '../components/layout/Header'
import FilterBar from '../components/filters/FilterBar'
import CatalogView from '../components/catalog/CatalogView'
import { Compass } from 'lucide-react'

export default function ExplorePage({ locations }) {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky header + filters */}
      <div className="flex-shrink-0 bg-ocean-900/95 backdrop-blur-sm border-b border-white/5">
        <Header
          title="Explorer"
          subtitle={`${locations.length} spots à découvrir`}
          actions={
            <div className="w-8 h-8 rounded-xl bg-ocean-800 flex items-center justify-center">
              <Compass size={16} className="text-sea-400" />
            </div>
          }
        />
        <div className="pb-2">
          <FilterBar />
        </div>
      </div>

      {/* Scrollable catalog */}
      <div className="flex-1 overflow-y-auto pt-3">
        <CatalogView locations={locations} />
      </div>
    </div>
  )
}
