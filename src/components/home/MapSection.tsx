'use client';

import dynamic from 'next/dynamic';
import { MapPin, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function MapSection() {
  const { filteredSpots } = useStore();

  return (
    <section className="pb-16 -mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end mb-3">
          <Link
            href="/mapa"
            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Tela cheia
          </Link>
        </div>

        <MapView spots={filteredSpots} height="450px" />

        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {filteredSpots.length} locais no mapa
          </span>
          <span className="text-xs text-gray-400">
            Clique nos marcadores para ver detalhes
          </span>
        </div>
      </div>
    </section>
  );
}
