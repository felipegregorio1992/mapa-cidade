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

// PUT - Atualizar evento
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

    const update = { ...body, updatedAt: new Date().toISOString() };
    delete update._id;

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE - Remover evento
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

    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
