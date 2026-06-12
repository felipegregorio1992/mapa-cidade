import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const spots = await db.collection('spots').find({}).toArray();
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Erro ao buscar spots:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const spot = {
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('spots').insertOne(spot);
    return NextResponse.json({ id: result.insertedId, ...spot }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar spot:', error);
    return NextResponse.json({ error: 'Erro ao criar local' }, { status: 500 });
  }
}
