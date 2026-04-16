import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { CustomerSupportChatbot } from '@/components/layout/customer-support-chatbot';

export const metadata: Metadata = {
  title: 'ChAcHaRiTaS - Tu Tienda de Cachivaches',
  description: 'La tienda online más completa y divertida. Encuentra tesoros, gadgets y artículos únicos con el poder de la IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toaster />
        <CustomerSupportChatbot />
      </body>
    </html>
  );
}
