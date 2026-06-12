import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import DataLoader from '@/components/DataLoader';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'TurismoEdu Maricá - Turismo Educacional Inteligente',
  description:
    'Plataforma de turismo educacional de Maricá, RJ. Descubra praias, trilhas, lagoas e a cultura caiçara com roteiros inteligentes e mapa interativo.',
  keywords: 'turismo, Maricá, RJ, praias, trilhas, Itaipuaçu, Ponta Negra, Pedra do Elefante, lagoa, cultura caiçara',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <DataLoader />
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
