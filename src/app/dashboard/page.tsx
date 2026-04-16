import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

// El dashboard requiere sesión activa → siempre dinámico, nunca pre-renderizado
export const dynamic = 'force-dynamic';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';
import { MonthlySpendingChart } from '@/components/dashboard/monthly-spending-chart';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const user = session.user;
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
            Mi Panel
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sidebar de perfil */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Miembro desde{' '}
                    {new Date(user.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  <Button variant="outline" className="w-full">Editar Perfil</Button>
                  <SignOutButton />
                </CardContent>
              </Card>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Compras</CardTitle>
                  <CardDescription>Visualiza tus gastos mensuales recientes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlySpendingChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Mis Pedidos</CardTitle>
                    <CardDescription>Revisa tus compras recientes y su estado.</CardDescription>
                  </div>
                  <Button variant="outline" size="icon">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Aún no tienes pedidos.</p>
                    <Button variant="link" className="mt-2 text-primary" asChild>
                      <a href="/productos">Empezar a comprar</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Direcciones</CardTitle>
                    <CardDescription>Gestiona tus direcciones de envío.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">No tienes direcciones guardadas.</p>
                    <Button variant="secondary" className="mt-4">Añadir Dirección</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pago</CardTitle>
                    <CardDescription>Administra tus tarjetas guardadas.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">No tienes métodos de pago.</p>
                    <Button variant="secondary" className="mt-4">Añadir Tarjeta</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
