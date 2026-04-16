import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { ProductRecommendations } from '@/components/product/product-recommendations';
import AddToCartButton from './add-to-cart-button';

type Props = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: Props) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const image = getPlaceholderImage(product.imageId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={image.imageUrl}
                alt={product.name}
                data-ai-hint={image.imageHint}
                width={800}
                height={600}
                className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              <Separator className="my-6" />
              <p className="text-base text-muted-foreground">{product.description}</p>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Disponibilidad: <span className="font-medium text-foreground">{product.stock} en stock</span>
                </p>
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

// Add a helper component to keep the main page as a Server Component
'use client';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: 'Producto añadido',
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
    </Button>
  );
}
