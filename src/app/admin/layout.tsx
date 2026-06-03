import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Package, ShoppingCart, Users, LayoutDashboard } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin" className="font-bold text-lg tracking-tight">
            ⚙️ Admin
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">ChAcHaRiTaS</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/admin/productos', icon: Package, label: 'Productos' },
            { href: '/admin/ordenes', icon: ShoppingCart, label: 'Órdenes' },
            { href: '/admin/usuarios', icon: Users, label: 'Usuarios' },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className="px-3 py-2 text-xs text-muted-foreground mb-2 truncate">
            {session.user.email}
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
