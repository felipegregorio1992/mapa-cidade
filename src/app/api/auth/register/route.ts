import clientPromise from '@/lib/mongodb';
import { signToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('turismo-marica');

    // Verifica se o email já está cadastrado
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria o usuário
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user' as const,
      avatar: null,
      favorites: [],
      visitedSpots: [],
      achievements: [],
      points: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('users').insertOne(newUser);

    // Gera o token JWT
    const token = signToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    // Retorna o token no cookie e no body
    const response = NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: 'Conta criada com sucesso',
    }, { status: 201 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
