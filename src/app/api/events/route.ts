import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const events = await db.collection('events').find({}).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const event = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('events').insertOne(event);
    return NextResponse.json({ id: result.insertedId, ...event }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}
