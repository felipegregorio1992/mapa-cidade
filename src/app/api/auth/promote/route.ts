import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Rota utilitária para promover um usuário a admin
// Uso: POST /api/auth/promote { "email": "admin@turismoedu.com.br" }
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('turismo-marica');

    const result = await db.collection('users').updateOne(
      { email: email.toLowerCase() },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: `Usuário ${email} promovido a admin` });
  } catch (error) {
    console.error('Erro ao promover:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
