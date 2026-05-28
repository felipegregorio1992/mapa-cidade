'use client';

import { Search } from 'lucide-react';
import SpotCard from '@/components/ui/SpotCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { useStore } from '@/store/useStore';

export default function ExplorarPage() {
  const { filteredSpots, searchQuery, setSearchQuery } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explorar</h1>
        <p className="mt-2 text-gray-500">
          Descubra todos os pontos turísticos da cidade
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="mb-8">
        <CategoryFilter />
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {filteredSpots.length} {filteredSpots.length === 1 ? 'local encontrado' : 'locais encontrados'}
        </p>
      </div>

      {filteredSpots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Nenhum local encontrado</p>
          <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou a busca</p>
        </div>
      )}
    </div>
  );
}
