import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET público - Buscar configurações do site (para o banner)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const settings = await db.collection('settings').findOne({ key: 'site' });
    return NextResponse.json(settings || { bannerUrl: '', banners: [] });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ bannerUrl: '', banners: [] });
  }
}
