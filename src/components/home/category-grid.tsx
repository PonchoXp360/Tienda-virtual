import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/images';

export function CategoryGrid() {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explora por Categoría
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Encuentra exactamente lo que buscas en nuestras categorías de productos.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
          {categories.map((category) => {
            const image = getPlaceholderImage(category.imageId);
            return (
              <Link href={`/productos?categoria=${category.id}`} key={category.id} className="group relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                <Image
                  src={image.imageUrl}
                  alt={category.name}
                  data-ai-hint={image.imageHint}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
