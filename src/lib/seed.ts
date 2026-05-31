/**
 * Script de seed para la base de datos.
 * Ejecutar con: npm run db:seed
 *
 * Siembra productos y categorías con los datos del catálogo inicial.
 */

import { PrismaClient } from '@prisma/client';
import { products, categories } from './data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Solo sembrar si no hay datos ya (idempotente — no borra órdenes en producción)
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log(`⏭️  ${existingProducts} productos ya existen — omitiendo seed destructivo.`);
    return;
  }

  // Sembrar categorías
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { imageId: category.imageId },
      create: {
        id: category.id,
        name: category.name,
        imageId: category.imageId,
      },
    });
  }
  console.log(`✅ ${categories.length} categorías sembradas`);

  // Sembrar productos
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageId: product.imageId,
        stock: product.stock,
        category: product.category,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageId: product.imageId,
        stock: product.stock,
        category: product.category,
      },
    });
  }
  console.log(`✅ ${products.length} productos sembrados`);

  console.log('🎉 Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
