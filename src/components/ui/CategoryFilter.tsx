'use client';

import {
  Waves,
  Palette,
  Landmark,
  TreePine,
  UtensilsCrossed,
  Church,
  Dumbbell,
  GraduationCap,
  CalendarDays,
  LayoutGrid,
} from 'lucide-react';
import { Category } from '@/types';
import { useStore } from '@/store/useStore';
import { categoryLabels } from '@/data/spots';

const categoryIcons: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="w-5 h-5" />,
  praia: <Waves className="w-5 h-5" />,
  cultural: <Palette className="w-5 h-5" />,
  historico: <Landmark className="w-5 h-5" />,
  ecologico: <TreePine className="w-5 h-5" />,
  gastronomico: <UtensilsCrossed className="w-5 h-5" />,
  religioso: <Church className="w-5 h-5" />,
  esportivo: <Dumbbell className="w-5 h-5" />,
  educacional: <GraduationCap className="w-5 h-5" />,
  eventos: <CalendarDays className="w-5 h-5" />,
};

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useStore();

  const categories: (Category | 'all')[] = [
    'all',
    'praia',
    'cultural',
    'historico',
    'ecologico',
    'gastronomico',
    'religioso',
    'esportivo',
    'educacional',
    'eventos',
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 border border-gray-200'
            }`}
          >
            {categoryIcons[cat]}
            <span>{cat === 'all' ? 'Todos' : categoryLabels[cat]}</span>
          </button>
        );
      })}
    </div>
  );
}
