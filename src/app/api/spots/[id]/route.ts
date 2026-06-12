import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('turismo-marica');

    let spot;
    // Tenta buscar por ObjectId ou pelo campo id customizado
    if (ObjectId.isValid(id)) {
      spot = await db.collection('spots').findOne({ _id: new ObjectId(id) });
    }
    if (!spot) {
      spot = await db.collection('spots').findOne({ id });
    }

    if (!spot) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 });
    }

    return NextResponse.json(spot);
  } catch (error) {
    console.error('Erro ao buscar spot:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const update = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection('spots').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
    } else {
      result = await db.collection('spots').updateOne(
        { id },
        { $set: update }
      );
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar spot:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('turismo-marica');

    let result;
    if (ObjectId.isValid(id)) {
      result = await db.collection('spots').deleteOne({ _id: new ObjectId(id) });
    } else {
      result = await db.collection('spots').deleteOne({ id });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover spot:', error);
    return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
  }
}
