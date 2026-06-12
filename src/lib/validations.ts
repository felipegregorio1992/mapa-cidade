import { z } from 'zod';

export const spotSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  category: z.enum(['praia', 'cultural', 'historico', 'ecologico', 'gastronomico', 'religioso', 'esportivo', 'educacional', 'eventos']),
  address: z.string().min(5, 'Endereço obrigatório'),
  cep: z.string().optional().default(''),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  openingHours: z.string().optional().default(''),
  operatingDays: z.array(z.string()).optional().default([]),
  phones: z.array(z.string()).optional().default([]),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }).optional().default({}),
  website: z.string().optional().default(''),
  observations: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  status: z.enum(['active', 'inactive', 'pending']).optional().default('pending'),
  featured: z.boolean().optional().default(false),
  rating: z.number().optional().default(0),
  totalReviews: z.number().optional().default(0),
});

export const eventSchema = z.object({
  title: z.string().min(2, 'Título obrigatório'),
  description: z.string().optional().default(''),
  date: z.string().min(1, 'Data obrigatória'),
  endDate: z.string().optional().default(''),
  location: z.string().min(2, 'Local obrigatório'),
  spotId: z.string().optional(),
  image: z.string().optional(),
  category: z.enum(['praia', 'cultural', 'historico', 'ecologico', 'gastronomico', 'religioso', 'esportivo', 'educacional', 'eventos']),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const reviewSchema = z.object({
  spotId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Comentário deve ter pelo menos 3 caracteres'),
  photos: z.array(z.string()).optional().default([]),
});
