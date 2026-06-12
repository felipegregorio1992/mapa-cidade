'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SpotCard from '@/components/ui/SpotCard';
import { useStore } from '@/store/useStore';

export default function FeaturedSpots() {
  const { spots, isLoading } = useStore();
  const featured = spots.filter((s) => s.featured && s.status === 'active');

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Locais em Destaque
            </h2>
            <p className="mt-2 text-gray-500">
              Os pontos turísticos mais visitados e bem avaliados
            </p>
          </div>
          <Link
            href="/explorar"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.map((spot, index) => (
            <div key={spot.id || spot._id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <SpotCard spot={spot} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/explorar"
            className="inline-flex items-center gap-1 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
          >
            Ver todos os locais
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
