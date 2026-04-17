'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductImage } from '@/components/product-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/producto/${product.id}`} className="block overflow-hidden">
          <ProductImage
            imageId={product.imageId}
            alt={product.name}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-base font-semibold leading-tight">
          <Link href={`/producto/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Button size="sm" variant="secondary" onClick={handleAddToCart} disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? 'Añadir' : 'Agotado'}
        </Button>
      </CardFooter>
    </Card>
  );
}
