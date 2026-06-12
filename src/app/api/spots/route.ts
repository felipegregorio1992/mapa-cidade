import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('turismo-marica');

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      filter.category = category;
    }

    const [spots, total] = await Promise.all([
      db.collection('spots').find(filter).skip(skip).limit(limit).toArray(),
      db.collection('spots').countDocuments(filter),
    ]);

    return NextResponse.json({
      spots,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
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
