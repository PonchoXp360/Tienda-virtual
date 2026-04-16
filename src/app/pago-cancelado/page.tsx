import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PagoCanceladoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4 max-w-md">
          <div className="flex justify-center">
            <XCircle className="h-20 w-20 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Pago cancelado</h1>
          <p className="text-muted-foreground">
            No se realizó ningún cargo. Tu carrito sigue intacto, puedes intentarlo de nuevo cuando quieras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/carrito">Volver al carrito</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
