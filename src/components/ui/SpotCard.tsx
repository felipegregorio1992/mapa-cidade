'use client';

import { Heart, MapPin, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { TouristSpot } from '@/types';
import { categoryLabels, categoryColors } from '@/data/spots';
import { useStore } from '@/store/useStore';

interface SpotCardProps {
  spot: TouristSpot;
  compact?: boolean;
}

export default function SpotCard({ spot, compact = false }: SpotCardProps) {
  const { favorites, toggleFavorite } = useStore();
  const spotId = spot.id || (spot as unknown as { _id: string })._id;
  const isFavorite = favorites.includes(spotId);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-teal-100 to-emerald-50 overflow-hidden">
        {spot.images && spot.images.length > 0 && spot.images[0] ? (
          <img src={spot.images[0]} alt={spot.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-teal-300" />
          </div>
        )}
        {spot.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full shadow-sm">
            Destaque
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(spotId);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`}
          />
        </button>
        {/* Category badge */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-medium text-white rounded-full shadow-sm"
          style={{ backgroundColor: categoryColors[spot.category] }}
        >
          {categoryLabels[spot.category]}
        </div>
      </div>

      {/* Content */}
      <Link href={`/local/${spotId}`} className="block p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">
          {spot.name}
        </h3>

        {!compact && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{spot.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{spot.rating}</span>
            <span className="text-xs text-gray-400">({spot.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{spot.openingHours}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1 text-gray-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs line-clamp-1">{spot.address}</span>
        </div>
      </Link>
    </div>
  );
}
