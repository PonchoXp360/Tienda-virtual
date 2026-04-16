'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CartIcon() {
  const items = useCartStore((state) => state.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/carrito">
        <ShoppingBag className="h-6 w-6" />
        {isClient && totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {totalItems}
          </span>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
}
