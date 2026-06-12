import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Middleware de admin
async function checkAdmin() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
    return null;
  }
  return session;
}

// GET - Listar todos os spots (incluindo pendentes e inativos)
export async function GET() {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const spots = await db.collection('spots').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Erro ao buscar spots:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar novo spot (admin)
export async function POST(request: NextRequest) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const spot = {
      ...body,
      status: body.status || 'active',
      rating: body.rating || 0,
      totalReviews: body.totalReviews || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.userId,
    };

    const result = await db.collection('spots').insertOne(spot);
    return NextResponse.json({ _id: result.insertedId, ...spot }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar spot:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
