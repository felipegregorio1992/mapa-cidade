'use client';

import { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Users,
  Car,
  Wallet,
  Baby,
  CheckCircle2,
  Navigation,
  RotateCcw,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store/useStore';
import { Category, ItineraryPreferences } from '@/types';
import { categoryLabels, categoryColors } from '@/data/spots';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function RoteiroPage() {
  const { generatedItinerary, generateItinerary, setItineraryPreferences } = useStore();
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<ItineraryPreferences>({
    tourismType: [],
    numberOfPeople: 2,
    availableTime: 4,
    transportMode: 'walking',
    budget: 'medium',
    ageGroup: 'adults',
    preferences: [],
  });

  const handleGenerate = () => {
    setItineraryPreferences(prefs);
    generateItinerary();
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setPrefs({
      tourismType: [],
      numberOfPeople: 2,
      availableTime: 4,
      transportMode: 'walking',
      budget: 'medium',
      ageGroup: 'adults',
      preferences: [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Roteiro Inteligente com IA
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Crie seu roteiro personalizado
        </h1>
        <p className="mt-3 text-gray-500 max-w-lg mx-auto">
          Responda algumas perguntas e nossa IA gerará o roteiro ideal para você
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-teal-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Tourism Type & People */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Que tipo de turismo você prefere?
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {(Object.keys(categoryLabels) as Category[]).map((cat) => {
              const isSelected = prefs.tourismType.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setPrefs((p) => ({
                      ...p,
                      tourismType: isSelected
                        ? p.tourismType.filter((c) => c !== cat)
                        : [...p.tourismType, cat],
                    }));
                  }}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  {categoryLabels[cat]}
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Quantidade de pessoas
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={prefs.numberOfPeople}
              onChange={(e) => setPrefs((p) => ({ ...p, numberOfPeople: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Step 2: Time, Transport, Budget */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detalhes do passeio
          </h2>

          {/* Available Time */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Tempo disponível (horas)
            </label>
            <input
              type="range"
              min={2}
              max={12}
              value={prefs.availableTime}
              onChange={(e) => setPrefs((p) => ({ ...p, availableTime: Number(e.target.value) }))}
              className="w-full accent-teal-600"
            />
            <p className="text-sm text-gray-500 mt-1">{prefs.availableTime} horas</p>
          </div>

          {/* Transport */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Car className="w-4 h-4" />
              Meio de transporte
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['walking', 'driving', 'cycling', 'public'] as const).map((mode) => {
                const labels = { walking: 'A pé', driving: 'Carro', cycling: 'Bicicleta', public: 'Transporte público' };
                return (
                  <button
                    key={mode}
                    onClick={() => setPrefs((p) => ({ ...p, transportMode: mode }))}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      prefs.transportMode === mode
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {labels[mode]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Wallet className="w-4 h-4" />
              Orçamento
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((budget) => {
                const labels = { low: 'Econômico', medium: 'Moderado', high: 'Premium' };
                return (
                  <button
                    key={budget}
                    onClick={() => setPrefs((p) => ({ ...p, budget }))}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      prefs.budget === budget
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {labels[budget]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Group */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Baby className="w-4 h-4" />
              Faixa etária
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['children', 'teens', 'adults', 'seniors', 'mixed'] as const).map((age) => {
                const labels = { children: 'Crianças', teens: 'Jovens', adults: 'Adultos', seniors: 'Idosos', mixed: 'Misto' };
                return (
                  <button
                    key={age}
                    onClick={() => setPrefs((p) => ({ ...p, ageGroup: age }))}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      prefs.ageGroup === age
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-600 hover:border-teal-300'
                    }`}
                  >
                    {labels[age]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Roteiro
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Seu Roteiro Personalizado</h2>
                <p className="text-teal-100 text-sm mt-1">
                  {generatedItinerary.length} locais • ~{prefs.availableTime}h de passeio
                </p>
              </div>
              <button
                onClick={handleReset}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Refazer roteiro"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Itinerary List */}
          <div className="space-y-4">
            {generatedItinerary.map((spot, index) => (
              <div
                key={spot.id}
                className="flex gap-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < generatedItinerary.length - 1 && (
                    <div className="w-0.5 flex-1 bg-teal-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{categoryLabels[spot.category]}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      ~{Math.round(prefs.availableTime / generatedItinerary.length * 60)}min
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{spot.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {spot.address}
                    </span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Navigation className="w-3 h-3" />
                    Ver rota
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          {generatedItinerary.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Mapa do Roteiro</h3>
              <MapView spots={generatedItinerary} height="350px" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
