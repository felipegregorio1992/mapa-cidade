import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { reviewSchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

// GET - Buscar reviews de um spot
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get('spotId');

    if (!spotId) {
      return NextResponse.json({ error: 'spotId obrigatório' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const reviews = await db.collection('reviews')
      .find({ spotId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar review (precisa estar logado)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Faça login para avaliar' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('turismo-marica');

    const review = {
      ...parsed.data,
      userId: session.userId,
      userName: session.name,
      createdAt: new Date().toISOString(),
    };

    await db.collection('reviews').insertOne(review);

    // Atualiza rating do spot
    const reviews = await db.collection('reviews').find({ spotId: parsed.data.spotId }).toArray();
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    // Atualiza o spot com novo rating
    const spotFilter = ObjectId.isValid(parsed.data.spotId)
      ? { _id: new ObjectId(parsed.data.spotId) }
      : { id: parsed.data.spotId };

    await db.collection('spots').updateOne(spotFilter, {
      $set: { rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar review:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
