'use client';

import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ product }: { product: Product }) {
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
