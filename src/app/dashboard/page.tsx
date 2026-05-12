import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';
import { MonthlySpendingChart } from '@/components/dashboard/monthly-spending-chart';
import { SignOutButton } from '@/components/auth/sign-out-button';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const ORDER_STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  PAID: 'default',
  SHIPPED: 'default',
  DELIVERED: 'outline',
  CANCELLED: 'destructive',
};

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const user = session.user;
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Gráfica: gastos mensuales de los últimos 6 meses (solo órdenes PAID)
  const now = new Date();
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return (
        o.status === 'PAID' &&
        od.getFullYear() === d.getFullYear() &&
        od.getMonth() === d.getMonth()
      );
    });
    return {
      month: MONTH_NAMES[d.getMonth()],
      spending: Number(monthOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)),
    };
  });

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
                  <CardDescription>Tus gastos en los últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlySpendingChart data={chartData} />
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
                  {orders.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Aún no tienes pedidos.</p>
                      <Button variant="link" className="mt-2 text-primary" asChild>
                        <a href="/productos">Empezar a comprar</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-start justify-between p-4 rounded-lg border bg-muted/30"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                              {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                              {order.items.length > 0 && (
                                <span className="text-muted-foreground font-normal">
                                  {' '}— {order.items[0].product.name}
                                  {order.items.length > 1 && ` y ${order.items.length - 1} más`}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm font-bold text-primary">
                              ${order.total.toFixed(2)}
                            </span>
                            <Badge variant={ORDER_STATUS_VARIANTS[order.status] ?? 'secondary'}>
                              {ORDER_STATUS_LABELS[order.status] ?? order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
