import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET - Listar todos os usuários (sem senha)
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
