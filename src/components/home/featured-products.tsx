import { getFeaturedProducts } from '@/lib/actions/products';
import { ProductCard } from '@/components/product-card';

export async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Productos Destacados
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Una selección de nuestros productos más populares y mejor valorados.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
