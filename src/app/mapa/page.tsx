'use client';

import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import CategoryFilter from '@/components/ui/CategoryFilter';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function MapaPage() {
  const { filteredSpots } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mapa Interativo</h1>
        <p className="mt-2 text-gray-500">
          Visualize todos os pontos turísticos no mapa e encontre os mais próximos de você
        </p>
      </div>

      <div className="mb-6">
        <CategoryFilter />
      </div>

      <MapView spots={filteredSpots} height="calc(100vh - 280px)" />

      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Legenda</h3>
        <div className="flex flex-wrap gap-3">
          <LegendItem color="#06b6d4" label="Praia" />
          <LegendItem color="#8b5cf6" label="Cultural" />
          <LegendItem color="#f59e0b" label="Histórico" />
          <LegendItem color="#22c55e" label="Ecológico" />
          <LegendItem color="#ef4444" label="Gastronômico" />
          <LegendItem color="#6366f1" label="Religioso" />
          <LegendItem color="#f97316" label="Esportivo" />
          <LegendItem color="#0ea5e9" label="Educacional" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}
