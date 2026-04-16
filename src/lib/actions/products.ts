'use server';

/**
 * Server actions para productos.
 * Usa Prisma si DATABASE_URL está configurada, si no usa datos mock como fallback.
 */

import type { Product, Category } from '@/lib/types';
import { products as mockProducts, categories as mockCategories } from '@/lib/data';

async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { prisma } = await import('@/lib/prisma');
    // Verificar conexión con un ping
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const prisma = await getPrisma();
  if (prisma) {
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  const prisma = await getPrisma();
  if (prisma) {
    return prisma.product.findUnique({ where: { id } });
  }
  return mockProducts.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const prisma = await getPrisma();
  if (prisma) {
    return prisma.product.findMany({ where: { category }, orderBy: { createdAt: 'desc' } });
  }
  return mockProducts.filter((p) => p.category === category);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const prisma = await getPrisma();
  if (prisma) {
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  }
  return mockProducts.slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const prisma = await getPrisma();
  const q = query.toLowerCase();
  if (prisma) {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

// ─────────────────────────────────────────────
// CATEGORÍAS
// ─────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const prisma = await getPrisma();
  if (prisma) {
    return prisma.category.findMany();
  }
  return mockCategories;
}
