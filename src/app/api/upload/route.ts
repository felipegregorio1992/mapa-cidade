import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validações
      if (!file.type.startsWith('image/')) {
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      // Converte para base64 para enviar ao Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      // Upload para Cloudinary
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'turismo-marica',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto' },
        ],
      });

      uploadedUrls.push(result.secure_url);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem válida (JPG/PNG até 5MB)' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      paths: uploadedUrls,
      message: `${uploadedUrls.length} imagem(ns) enviada(s)`,
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao processar upload' },
      { status: 500 }
    );
  }
}
