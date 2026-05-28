'use client';

import { Compass, Users, TreePine, Sparkles } from 'lucide-react';

export default function AboutCity() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Sobre Maricá
          </h2>
          <p className="mt-3 text-gray-500 leading-relaxed">
            Maricá é uma cidade litorânea do Rio de Janeiro com praias paradisíacas, lagoas,
            trilhas ecológicas e uma rica cultura caiçara. Descubra tudo o que temos a oferecer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Compass className="w-6 h-6" />}
            title="Turismo Inteligente"
            description="Roteiros personalizados com IA que se adaptam às suas preferências"
            color="teal"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Colaborativo"
            description="Comunidade ativa que contribui com informações e avaliações"
            color="purple"
          />
          <FeatureCard
            icon={<TreePine className="w-6 h-6" />}
            title="Sustentável"
            description="Promovemos o ecoturismo e a preservação do patrimônio local"
            color="green"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Educacional"
            description="Conteúdo cultural e histórico para enriquecer sua experiência"
            color="amber"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
