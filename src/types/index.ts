export type Category =
  | 'praia'
  | 'cultural'
  | 'historico'
  | 'ecologico'
  | 'gastronomico'
  | 'religioso'
  | 'esportivo'
  | 'educacional'
  | 'eventos';

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: Category;
  address: string;
  cep: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  operatingDays: string[];
  phones: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  website?: string;
  observations?: string;
  images: string[];
  videos?: string[];
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  spotId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
  favorites: string[];
  visitedSpots: string[];
  achievements: Achievement[];
  points: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface RouteItinerary {
  id: string;
  name: string;
  spots: TouristSpot[];
  totalDistance: number;
  estimatedTime: number;
  transportMode: 'walking' | 'driving' | 'cycling' | 'public';
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  spotId?: string;
  image?: string;
  category: Category;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface ItineraryPreferences {
  tourismType: Category[];
  numberOfPeople: number;
  availableTime: number; // in hours
  transportMode: 'walking' | 'driving' | 'cycling' | 'public';
  budget: 'low' | 'medium' | 'high';
  ageGroup: 'children' | 'teens' | 'adults' | 'seniors' | 'mixed';
  preferences: string[];
}
