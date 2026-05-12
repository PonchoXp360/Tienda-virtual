'use server';

import { getPlaceholderImage } from '@/lib/images';
import type { RecommendedProduct } from '@/lib/types';

export type AIProductRecommendationsInput = {
  productName: string;
  productDescription: string;
  productCategory: string;
  productPrice: number;
};

export type AIProductRecommendationsOutput = {
  recommendations: RecommendedProduct[];
};

async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

export async function getProductRecommendations(
  input: AIProductRecommendationsInput
): Promise<AIProductRecommendationsOutput> {
  const prisma = await getPrisma();
  if (!prisma) return { recommendations: [] };

  // Primero productos de la misma categoría, excluyendo el actual por nombre
  const sameCategory = await prisma.product.findMany({
    where: {
      category: input.productCategory,
      NOT: { name: input.productName },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  // Rellena con otras categorías si hacen falta
  let pool = [...sameCategory];
  if (pool.length < 4) {
    const others = await prisma.product.findMany({
      where: {
        category: { not: input.productCategory },
        NOT: { name: input.productName },
      },
      take: 4 - pool.length,
      orderBy: { createdAt: 'desc' },
    });
    pool = [...pool, ...others];
  }

  const recommendations = pool.slice(0, 4).map((p) => {
    let imageUrl = `https://picsum.photos/seed/${p.imageId}/600/400`;
    try {
      imageUrl = getPlaceholderImage(p.imageId).imageUrl;
    } catch {
      // fallback si el imageId no está registrado
    }
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl,
    };
  });

  return { recommendations };
}
