import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { touristSpots, events } from '@/data/spots';

// Rota para popular o banco com os dados iniciais
// Acesse GET /api/seed para executar
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');

    // Limpa as collections existentes
    await db.collection('spots').deleteMany({});
    await db.collection('events').deleteMany({});

    // Insere os spots
    if (touristSpots.length > 0) {
      await db.collection('spots').insertMany(touristSpots as unknown as Document[]);
    }

    // Insere os eventos
    if (events.length > 0) {
      await db.collection('events').insertMany(events as unknown as Document[]);
    }

    return NextResponse.json({
      message: 'Banco populado com sucesso!',
      spots: touristSpots.length,
      events: events.length,
    });
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    return NextResponse.json({ error: 'Erro ao popular banco' }, { status: 500 });
  }
}
