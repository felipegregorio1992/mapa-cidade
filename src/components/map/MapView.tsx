'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TouristSpot } from '@/types';
import { categoryColors, categoryLabels } from '@/data/spots';
import { useStore } from '@/store/useStore';
import { Navigation, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createCategoryIcon(category: string) {
  const color = categoryColors[category] || '#0f766e';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function UserLocationMarker() {
  const { userLocation, setUserLocation } = useStore();
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
        },
        () => {
          // Default location if geolocation fails (Maricá center)
          setUserLocation({ lat: -22.9190, lng: -42.8200 });
        }
      );
    }
  }, [map, setUserLocation]);

  if (!userLocation) return null;

  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `<div style="
      width: 16px;
      height: 16px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-medium text-sm">Sua localização</p>
        </div>
      </Popup>
    </Marker>
  );
}

interface MapViewProps {
  spots: TouristSpot[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({
  spots,
  height = '500px',
  center = [-22.9190, -42.8200],
  zoom = 12,
}: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse-soft"
        style={{ height }}
      >
        <div className="text-center text-gray-400">
          <Navigation className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserLocationMarker />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={createCategoryIcon(spot.category)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm text-gray-900">{spot.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {categoryLabels[spot.category]} • ⭐ {spot.rating}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{spot.description}</p>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/local/${spot.id}`}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Ver detalhes
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Rota
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
