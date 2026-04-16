import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Settings, Edit } from 'lucide-react';

export default function DashboardPage() {
  // Mock user data
  const user = {
    name: 'Cliente Feliz',
    email: 'cliente@chacharitas.com',
    initials: 'CF',
    memberSince: 'Enero 2024',
    avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100'
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-6xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
            Mi Panel
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">Miembro desde {user.memberSince}</p>
                  <Button variant="outline" className="mt-4 w-full">Editar Perfil</Button>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pedidos</CardTitle>
                  <CardDescription>Revisa tus compras recientes y su estado.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No tienes pedidos recientes.</p>
                    <Button variant="link" className="mt-2">Ver todos los pedidos</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Direcciones de Envío</CardTitle>
                    <CardDescription>Gestiona tus direcciones guardadas.</CardDescription>
                  </div>
                   <Button variant="outline" size="icon"><MapPin className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No tienes direcciones guardadas.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Métodos de Pago</CardTitle>
                    <CardDescription>Administra tus tarjetas de crédito/débito.</CardDescription>
                  </div>
                   <Button variant="outline" size="icon"><CreditCard className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No tienes métodos de pago guardados.</p>
                </CardContent>
              </Card>

               <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>Ajusta las preferencias de tu cuenta.</CardDescription>
                  </div>
                   <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Cerrar Sesión</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
