'use client';

import { Search, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function HeroBanner() {
  const { setSearchQuery, spots } = useStore();

  const activeSpots = spots.filter((s) => s.status === 'active');
  const totalSpots = activeSpots.length;
  const categories = new Set(activeSpots.map((s) => s.category)).size;
  const avgRating = totalSpots > 0
    ? (activeSpots.reduce((acc, s) => acc + (s.rating || 0), 0) / totalSpots).toFixed(1)
    : '0';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Turismo Educacional Inteligente</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Descubra as belezas
            <br />
            <span className="text-emerald-200">de Maricá, RJ</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-teal-100 leading-relaxed max-w-2xl">
            Explore praias paradisíacas, trilhas com vistas incríveis, lagoas e a rica cultura
            caiçara de Maricá com roteiros personalizados por inteligência artificial.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pontos turísticos..."
                className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link
              href="/roteiro"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold rounded-xl shadow-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Roteiro IA
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-8">
            <div>
              <p className="text-3xl font-bold">{totalSpots}</p>
              <p className="text-sm text-teal-200">Pontos Turísticos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{categories}</p>
              <p className="text-sm text-teal-200">Categorias</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{avgRating}</p>
              <p className="text-sm text-teal-200">Avaliação Média</p>
            </div>
            <div>
              <p className="text-3xl font-bold">IA</p>
              <p className="text-sm text-teal-200">Roteiros Inteligentes</p>
            </div>
          </div>
        </div>

        {/* Floating card */}
        {activeSpots.length > 0 && (
        <div className="hidden lg:block absolute top-20 right-8 xl:right-16">
          <div className="w-64 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-emerald-300" />
              <span className="text-sm font-medium">Destaques</span>
            </div>
            <div className="space-y-2">
              {activeSpots.filter((s) => s.featured).slice(0, 3).map((spot) => (
                <div key={spot.id || (spot as unknown as {_id:string})._id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-cyan-400/30 rounded-lg flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{spot.name}</p>
                    <p className="text-[10px] text-teal-200">⭐ {spot.rating}</p>
                  </div>
                </div>
              ))}
              {activeSpots.filter((s) => s.featured).length === 0 && activeSpots.slice(0, 3).map((spot) => (
                <div key={spot.id || (spot as unknown as {_id:string})._id} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-cyan-400/30 rounded-lg flex items-center justify-center">
                    <span className="text-xs">📍</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">{spot.name}</p>
                    <p className="text-[10px] text-teal-200">⭐ {spot.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
