import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalOrders, totalProducts, totalUsers, revenueAgg] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { user: { select: { email: true, name: true } } },
  });

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: 'Órdenes totales', value: totalOrders, icon: ShoppingCart, href: '/admin/ordenes', color: 'text-blue-600' },
    { label: 'Productos activos', value: totalProducts, icon: Package, href: '/admin/productos', color: 'text-green-600' },
    { label: 'Usuarios', value: totalUsers, icon: Users, href: '/admin/usuarios', color: 'text-purple-600' },
    { label: 'Ingresos (pagados)', value: `$${Number(revenue).toFixed(2)}`, icon: DollarSign, href: '/admin/ordenes', color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Resumen del negocio en tiempo real.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-2xl font-bold">{value}</span>
                <Icon className={`w-6 h-6 ${color}`} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Órdenes recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 pr-4">ID</th>
                  <th className="text-left py-2 pr-4">Cliente</th>
                  <th className="text-left py-2 pr-4">Total</th>
                  <th className="text-left py-2 pr-4">Estado</th>
                  <th className="text-left py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="py-2 pr-4">
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-xs text-muted-foreground">{order.user.email}</div>
                    </td>
                    <td className="py-2 pr-4 font-semibold">${Number(order.total).toFixed(2)}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Sin órdenes aún.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
