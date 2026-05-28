'use client';

import { use } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Heart,
  Share2,
  Navigation,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { touristSpots } from '@/data/spots';
import { categoryLabels, categoryColors } from '@/data/spots';
import { useStore } from '@/store/useStore';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function LocalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const spot = touristSpots.find((s) => s.id === id);
  const { favorites, toggleFavorite } = useStore();

  if (!spot) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Local não encontrado</h1>
        <Link href="/explorar" className="mt-4 inline-flex items-center gap-1 text-teal-600 hover:text-teal-800">
          <ArrowLeft className="w-4 h-4" />
          Voltar para explorar
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(spot.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/explorar"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-teal-100 to-emerald-50 rounded-2xl overflow-hidden flex items-center justify-center">
            <MapPin className="w-20 h-20 text-teal-200" />
            <div
              className="absolute top-4 left-4 px-3 py-1.5 text-xs font-medium text-white rounded-full"
              style={{ backgroundColor: categoryColors[spot.category] }}
            >
              {categoryLabels[spot.category]}
            </div>
            {spot.featured && (
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                Destaque
              </div>
            )}
          </div>

          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{spot.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{spot.rating}</span>
                  <span className="text-sm text-gray-400">({spot.totalReviews} avaliações)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(spot.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-red-500'
                }`}
                aria-label="Favoritar"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-teal-600 transition-colors"
                aria-label="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <h2 className="text-lg font-semibold text-gray-900">Sobre</h2>
            <p className="text-gray-600 leading-relaxed">{spot.description}</p>
            {spot.observations && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Observações:</strong> {spot.observations}
                </p>
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Localização</h2>
            <MapView
              spots={[spot]}
              height="300px"
              center={[spot.latitude, spot.longitude]}
              zoom={15}
            />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Abrir rota no Google Maps
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
            <div className="space-y-4">
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Endereço" value={spot.address} />
              <InfoRow icon={<Clock className="w-4 h-4" />} label="Horário" value={spot.openingHours} />
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Funcionamento"
                value={spot.operatingDays.join(', ')}
              />
              {spot.phones.map((phone, i) => (
                <InfoRow key={i} icon={<Phone className="w-4 h-4" />} label="Telefone" value={phone} />
              ))}
              {spot.website && (
                <InfoRow icon={<Globe className="w-4 h-4" />} label="Site" value={spot.website} isLink />
              )}
            </div>
          </div>

          {/* Social Media */}
          {(spot.socialMedia.instagram || spot.socialMedia.facebook) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Redes Sociais</h3>
              <div className="flex gap-3">
                {spot.socialMedia.instagram && (
                  <a
                    href={`https://instagram.com/${spot.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg text-sm hover:bg-pink-100 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {spot.socialMedia.instagram}
                  </a>
                )}
                {spot.socialMedia.facebook && (
                  <a
                    href={`https://facebook.com/${spot.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Related Spots */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Locais Similares</h3>
            <div className="space-y-3">
              {touristSpots
                .filter((s) => s.category === spot.category && s.id !== spot.id && s.status === 'active')
                .slice(0, 3)
                .map((related) => (
                  <Link
                    key={related.id}
                    href={`/local/${related.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{related.name}</p>
                      <p className="text-xs text-gray-400">⭐ {related.rating}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-teal-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:text-teal-800 truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-gray-700">{value}</p>
        )}
      </div>
    </div>
  );
}
