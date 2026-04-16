import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterCta() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-primary/5 px-6 py-16 shadow-lg sm:px-16">
          <div className="relative z-10 max-w-xl text-center mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              No te pierdas ninguna oferta
            </h2>
            <p className="mt-4 text-lg text-primary/80">
              Suscríbete a nuestro boletín y sé el primero en conocer lanzamientos, descuentos exclusivos y noticias.
            </p>
            <form className="mt-8 flex max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 rounded-r-none focus:z-10"
                aria-label="Email address"
              />
              <Button type="submit" className="rounded-l-none bg-primary hover:bg-primary/90">
                Suscribirme
              </Button>
            </form>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full" />
        </div>
      </div>
    </section>
  );
}
