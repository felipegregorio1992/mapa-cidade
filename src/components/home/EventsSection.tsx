'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { categoryLabels, categoryColors } from '@/data/spots';
import { Event } from '@/types';

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setEvents(data); })
      .catch(() => {});
  }, []);

  const upcomingEvents = events.slice(0, 3);

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Próximos Eventos
            </h2>
            <p className="mt-2 text-gray-500">
              Fique por dentro do que está acontecendo na cidade
            </p>
          </div>
          <Link
            href="/eventos"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="inline-flex px-2.5 py-1 text-xs font-medium text-white rounded-full mb-3"
                style={{ backgroundColor: categoryColors[event.category] }}
              >
                {categoryLabels[event.category]}
              </div>
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{event.description}</p>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4 text-teal-500" />
                  <span>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-teal-500" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
