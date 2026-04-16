import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/images';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Separator } from '@/components/ui/separator';
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
