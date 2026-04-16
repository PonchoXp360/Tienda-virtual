import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
];

const footerLinks = [
  {
    title: 'Productos',
    links: [
      { name: 'Novedades', href: '#' },
      { name: 'Más vendidos', href: '#' },
      { name: 'Ofertas', href: '#' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { name: 'Contacto', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Envíos y devoluciones', href: '#' },
    ],
  },
  {
    title: 'Compañía',
    links: [
      { name: 'Sobre nosotros', href: '#' },
      { name: 'Carreras', href: '#' },
      { name: 'Términos y condiciones', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl">ChAcHaRiTaS</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Tu tienda online de confianza.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold tracking-wide text-foreground">{section.title}</h3>
                <ul className="mt-4 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-8 border-border" />
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChAcHaRiTaS. Todos los derechos reservados.
          </p>
          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href} className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">{social.name}</span>
                {/* You'd use an icon library here */}
                <span>{social.name.charAt(0)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
