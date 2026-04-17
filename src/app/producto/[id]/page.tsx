import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductImage } from '@/components/product-image';
import { getProductById, getAllProducts } from '@/lib/actions/products';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Separator } from '@/components/ui/separator';
import { ProductRecommendations } from '@/components/product/product-recommendations';
import AddToCartButton from './add-to-cart-button';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: Promise<{ id: string }>;
};

// Genera rutas estáticas. Si la DB no está disponible en build, retorna []
// para que el build no falle (las páginas se generan on-demand).
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

// Metadata dinámica por producto
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.name} — ChAcHaRiTaS`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg">
              <ProductImage
                imageId={product.imageId}
                alt={product.name}
                width={800}
                height={600}
                className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <Badge variant="outline" className="w-fit mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <Separator className="my-6" />
              <p className="text-base text-muted-foreground">{product.description}</p>
              <div className="mt-6">
                {product.stock === 0 ? (
                  <p className="text-sm font-medium text-destructive">Sin existencias</p>
                ) : isLowStock ? (
                  <p className="text-sm font-medium text-amber-600">
                    ¡Solo quedan {product.stock} en stock!
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Disponibilidad:{' '}
                    <span className="font-medium text-foreground">{product.stock} en stock</span>
                  </p>
                )}
              </div>
              <div className="mt-8">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>

          <Separator className="my-16" />

          <ProductRecommendations product={product} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
