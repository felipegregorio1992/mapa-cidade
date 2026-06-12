import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET - Buscar configurações do site
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const settings = await db.collection('settings').findOne({ key: 'site' });
    return NextResponse.json(settings || { bannerUrl: '', banners: [] });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PUT - Atualizar configurações (admin only)
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');
    const body = await request.json();

    await db.collection('settings').updateOne(
      { key: 'site' },
      { $set: { ...body, key: 'site', updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Configurações atualizadas' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
