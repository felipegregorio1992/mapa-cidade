import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

async function checkAdmin() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
    return null;
  }
  return session;
}

// GET - Listar todos os eventos
export async function GET() {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const events = await db.collection('events').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const event = {
      ...body,
      createdAt: new Date().toISOString(),
      createdBy: session.userId,
    };

    const result = await db.collection('events').insertOne(event);
    return NextResponse.json({ _id: result.insertedId, ...event }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
