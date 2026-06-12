import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

async function checkAdmin() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'moderator')) {
    return null;
  }
  return session;
}

// PUT - Atualizar spot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    const update = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    delete update._id;

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
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE - Remover spot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

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
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
