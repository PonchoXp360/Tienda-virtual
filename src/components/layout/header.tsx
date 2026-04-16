'use client';

import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartIcon } from './cart-icon';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/productos', label: 'Productos' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">ChAcHaRiTaS</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-6 w-6" />
            <span className="sr-only">Search</span>
          </Button>
          <CartIcon />
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/dashboard">
              <User className="h-6 w-6" />
              <span className="sr-only">User Account</span>
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="mr-6 flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <span className="font-bold">ChAcHaRiTaS</span>
              </Link>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                 <Link
                    href="/dashboard"
                    className="text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Mi Cuenta
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
