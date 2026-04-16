'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart-store';
import { getPlaceholderImage } from '@/lib/images';
import { Minus, Plus, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Error desconocido');
      }

      // Redirigir a Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('[Checkout]', err);
      toast({
        title: 'Error al procesar el pago',
        description: err instanceof Error ? err.message : 'Intenta de nuevo.',
        variant: 'destructive',
      });
      setCheckingOut(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Cargando carrito...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
            Tu Carrito de Compras
          </h1>
          {items.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-medium text-muted-foreground">Tu carrito está vacío.</h2>
              <Button asChild className="mt-4">
                <Link href="/productos">Seguir comprando</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Lista de items */}
              <div className="lg:col-span-2">
                <ul role="list" className="divide-y divide-border">
                  {items.map((item) => {
                    const image = getPlaceholderImage(item.imageId);
                    return (
                      <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                          <Image
                            src={image.imageUrl}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-foreground">
                              <h3>
                                <Link href={`/producto/${item.id}`} className="hover:text-primary">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="h-8 w-14 text-center"
                                min="1"
                                max={item.stock}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="font-medium text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Quitar
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Resumen del pedido */}
              <div className="lg:col-span-1">
                <div className="rounded-lg bg-card p-6 shadow-sm border sticky top-24">
                  <h2 className="text-lg font-medium text-foreground">Resumen de la Orden</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-sm font-medium">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Envío estimado</p>
                      <p className="text-sm font-medium">${shipping.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-base font-bold">
                      <p>Total</p>
                      <p className="text-primary">${total.toFixed(2)}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redirigiendo...</>
                    ) : (
                      <><CreditCard className="mr-2 h-5 w-5" /> Pagar con Stripe</>
                    )}
                  </Button>

                  <p className="mt-3 text-xs text-center text-muted-foreground">
                    Pago seguro procesado por Stripe
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
