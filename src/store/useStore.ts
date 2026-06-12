import { create } from 'zustand';
import { TouristSpot, Category, ItineraryPreferences } from '@/types';

interface AppState {
  // Spots
  spots: TouristSpot[];
  filteredSpots: TouristSpot[];
  selectedCategory: Category | 'all';
  searchQuery: string;
  selectedSpot: TouristSpot | null;
  isLoading: boolean;

  // User location
  userLocation: { lat: number; lng: number } | null;

  // UI State
  isMobileMenuOpen: boolean;
  isMapFullscreen: boolean;

  // Favorites
  favorites: string[];

  // Itinerary
  itineraryPreferences: ItineraryPreferences | null;
  generatedItinerary: TouristSpot[];

  // Actions
  fetchSpots: () => Promise<void>;
  setSelectedCategory: (category: Category | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedSpot: (spot: TouristSpot | null) => void;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  toggleMobileMenu: () => void;
  setMapFullscreen: (fullscreen: boolean) => void;
  toggleFavorite: (spotId: string) => void;
  setItineraryPreferences: (prefs: ItineraryPreferences) => void;
  generateItinerary: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  spots: [],
  filteredSpots: [],
  selectedCategory: 'all',
  searchQuery: '',
  selectedSpot: null,
  isLoading: true,
  userLocation: null,
  isMobileMenuOpen: false,
  isMapFullscreen: false,
  favorites: [],
  itineraryPreferences: null,
  generatedItinerary: [],

  fetchSpots: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/spots');
      if (!res.ok) throw new Error('Falha ao buscar spots');
      const data = await res.json();
      const activeSpots = data.filter((s: TouristSpot) => s.status === 'active');
      set({ spots: data, filteredSpots: activeSpots, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar spots da API:', error);
      // Em caso de falha de rede, tenta usar dados estáticos como fallback
      const { touristSpots } = await import('@/data/spots');
      set({ spots: touristSpots, filteredSpots: touristSpots.filter((s) => s.status === 'active'), isLoading: false });
    }
  },

  setSelectedCategory: (category) => {
    const { spots, searchQuery } = get();
    const filtered = spots.filter((spot) => {
      const matchesCategory = category === 'all' || spot.category === category;
      const matchesSearch =
        !searchQuery ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && spot.status === 'active';
    });
    set({ selectedCategory: category, filteredSpots: filtered });
  },

  setSearchQuery: (query) => {
    const { spots, selectedCategory } = get();
    const filtered = spots.filter((spot) => {
      const matchesCategory = selectedCategory === 'all' || spot.category === selectedCategory;
      const matchesSearch =
        !query ||
        spot.name.toLowerCase().includes(query.toLowerCase()) ||
        spot.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch && spot.status === 'active';
    });
    set({ searchQuery: query, filteredSpots: filtered });
  },

  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  setUserLocation: (location) => set({ userLocation: location }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMapFullscreen: (fullscreen) => set({ isMapFullscreen: fullscreen }),

  toggleFavorite: (spotId) => {
    set((state) => {
      const isFavorite = state.favorites.includes(spotId);
      return {
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== spotId)
          : [...state.favorites, spotId],
      };
    });
  },

  setItineraryPreferences: (prefs) => set({ itineraryPreferences: prefs }),

  generateItinerary: () => {
    const { spots, itineraryPreferences, userLocation } = get();
    if (!itineraryPreferences) return;

    let filtered = spots.filter(
      (spot) =>
        spot.status === 'active' &&
        (itineraryPreferences.tourismType.length === 0 ||
          itineraryPreferences.tourismType.includes(spot.category))
    );

    // Sort by rating and distance if user location available
    if (userLocation) {
      filtered.sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.latitude - userLocation.lat, 2) +
            Math.pow(a.longitude - userLocation.lng, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.latitude - userLocation.lat, 2) +
            Math.pow(b.longitude - userLocation.lng, 2)
        );
        return distA - distB;
      });
    } else {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Limit based on available time (approx 1.5h per spot)
    const maxSpots = Math.floor(itineraryPreferences.availableTime / 1.5);
    const itinerary = filtered.slice(0, Math.max(maxSpots, 2));

    set({ generatedItinerary: itinerary });
  },
}));
