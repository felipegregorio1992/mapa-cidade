'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
}

function ClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ latitude, longitude, onLocationSelect }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  const handleClick = async (lat: number, lng: number) => {
    setPosition([lat, lng]);

    // Geocoding reverso usando Nominatim (OpenStreetMap)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await res.json();
      const address = data.display_name || '';
      onLocationSelect(lat, lng, address);
    } catch {
      onLocationSelect(lat, lng);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MapPin className="w-6 h-6 mx-auto mb-1" />
          <p className="text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Clique no mapa para selecionar a localização
      </p>
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '300px' }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationSelect={handleClick} />
          <Marker position={position} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400">
        📍 Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
      </p>
    </div>
  );
}
