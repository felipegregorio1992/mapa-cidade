'use client';

import dynamic from 'next/dynamic';
import { MapPin, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { touristSpots } from '@/data/spots';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function MapSection() {
  const activeSpots = touristSpots.filter((s) => s.status === 'active');

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Mapa Interativo
            </h2>
            <p className="mt-2 text-gray-500">
              Encontre pontos turísticos próximos a você
            </p>
          </div>
          <Link
            href="/mapa"
            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Tela cheia
          </Link>
        </div>

        <MapView spots={activeSpots} height="450px" />

        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {activeSpots.length} locais no mapa
          </span>
          <span className="text-xs text-gray-400">
            Clique nos marcadores para ver detalhes
          </span>
        </div>
      </div>
    </section>
  );
}
