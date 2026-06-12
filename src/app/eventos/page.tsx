'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Clock, Loader2 } from 'lucide-react';
import { categoryLabels, categoryColors } from '@/data/spots';
import { Event } from '@/types';

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
        <p className="mt-2 text-gray-500">
          Confira os próximos eventos e atividades na cidade
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal-600 animate-spin" /></div>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Nenhum evento cadastrado</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Color bar */}
            <div className="h-2" style={{ backgroundColor: categoryColors[event.category] }} />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className="inline-flex px-2.5 py-1 text-xs font-medium text-white rounded-full mb-3"
                    style={{ backgroundColor: categoryColors[event.category] }}
                  >
                    {categoryLabels[event.category]}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                  <p className="mt-2 text-gray-500">{event.description}</p>
                </div>

                {/* Date badge */}
                <div className="shrink-0 text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-2xl font-bold text-teal-600">
                    {new Date(event.date).getDate()}
                  </p>
                  <p className="text-xs text-gray-500 uppercase">
                    {new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4 text-teal-500" />
                  <span>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {event.endDate && (
                      <>
                        {' '}
                        até{' '}
                        {new Date(event.endDate).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                        })}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
