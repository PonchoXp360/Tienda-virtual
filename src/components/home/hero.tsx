import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPlaceholderImage } from '@/lib/images';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = getPlaceholderImage('hero-background');

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        data-ai-hint={heroImage.imageHint}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end text-center text-primary-foreground">
        <div className="container max-w-3xl pb-16">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Tecnología y Estilo, a un Click de Distancia
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-primary-foreground/80">
            Descubre las últimas tendencias en tecnología, periféricos y mucho más. Calidad y servicio que te encantarán.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link href="/productos">
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-primary/20 border-primary-foreground text-primary-foreground hover:bg-primary/30">
              <Link href="#ofertas">Ver Ofertas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
