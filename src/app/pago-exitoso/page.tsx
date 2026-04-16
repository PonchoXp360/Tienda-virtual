import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PagoExitosoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4 max-w-md">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">¡Pago exitoso!</h1>
          <p className="text-muted-foreground">
            Tu pedido ha sido confirmado. Recibirás un correo con los detalles de tu compra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard">Ver mis pedidos</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/productos">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
