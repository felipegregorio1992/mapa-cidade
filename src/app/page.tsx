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

      {/* Categories */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter />
        </div>
      </section>

      <FeaturedSpots />
      <MapSection />
      <AboutCity />
      <EventsSection />
    </>
  );
}
