import HeroBanner from '@/components/home/HeroBanner';
import FeaturedSpots from '@/components/home/FeaturedSpots';
import MapSection from '@/components/home/MapSection';
import EventsSection from '@/components/home/EventsSection';
import AboutCity from '@/components/home/AboutCity';
import CategoryFilter from '@/components/ui/CategoryFilter';

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <FeaturedSpots />

      {/* Map with filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Mapa Interativo
              </h2>
              <p className="mt-2 text-gray-500">
                Filtre por categoria e encontre pontos turísticos próximos a você
              </p>
            </div>
          </div>
          <div className="mb-4">
            <CategoryFilter />
          </div>
        </div>
      </section>

      <MapSection />
      <AboutCity />
      <EventsSection />
    </>
  );
}
