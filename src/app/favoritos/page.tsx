'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import SpotCard from '@/components/ui/SpotCard';
import { useStore } from '@/store/useStore';

export default function FavoritosPage() {
  const { favorites, spots } = useStore();
  const favoriteSpots = spots.filter((s) => favorites.includes(s.id || (s as unknown as {_id: string})._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Favoritos</h1>
        <p className="mt-2 text-gray-500">
          Seus pontos turísticos salvos
        </p>
      </div>

      {favoriteSpots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoriteSpots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Nenhum favorito ainda</h2>
          <p className="text-gray-400 mt-2">
            Explore os pontos turísticos e salve seus favoritos
          </p>
          <Link
            href="/explorar"
            className="mt-6 inline-flex px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
          >
            Explorar locais
          </Link>
        </div>
      )}
    </div>
  );
}
