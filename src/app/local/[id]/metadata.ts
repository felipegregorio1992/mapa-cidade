import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db('turismo-marica');

    let spot;
    if (ObjectId.isValid(id)) {
      spot = await db.collection('spots').findOne({ _id: new ObjectId(id) });
    }
    if (!spot) {
      spot = await db.collection('spots').findOne({ id });
    }

    if (!spot) {
      return { title: 'Local não encontrado | TurismoEdu Maricá' };
    }

    return {
      title: `${spot.name} | TurismoEdu Maricá`,
      description: spot.description?.slice(0, 160),
      openGraph: {
        title: spot.name,
        description: spot.description?.slice(0, 160),
        images: spot.images?.[0] ? [spot.images[0]] : [],
      },
    };
  } catch {
    return { title: 'TurismoEdu Maricá' };
  }
}
