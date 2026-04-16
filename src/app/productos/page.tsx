import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/product-card';
import { getAllProducts, getAllCategories, getProductsByCategory } from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Catálogo — ChAcHaRiTaS',
  description: 'Explora nuestro catálogo completo de productos.',
};

type Props = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const [allProducts, categories, filteredProducts] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    categoria ? getProductsByCategory(categoria) : getAllProducts(),
  ]);

  const products = categoria ? filteredProducts : allProducts;
  const activeCategory = categoria ?? null;
  const selectedCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {selectedCategory ? selectedCategory.name : 'Nuestro Catálogo'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filtros por categoría */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Button
              asChild
              variant={!activeCategory ? 'default' : 'outline'}
              size="sm"
            >
              <Link href="/productos">Todos</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
              >
                <Link href={`/productos?categoria=${cat.id}`}>{cat.name}</Link>
              </Button>
            ))}
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground text-lg">
                No hay productos en esta categoría.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/productos">Ver todos los productos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
