import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.almaexpresion.com'),
  title: {
    default: 'Alma & Expresión - Escuela de Danzas y Ritmos Caribeños',
    template: '%s | Alma & Expresión',
  },
  description:
    'Escuela de ritmos caribeños en Tucumán con 14 años de experiencia. Clases de salsa, bachata, merengue y más con la profesora Magui Arias. ¡Inscribite hoy!',
  keywords: [
    'salsa',
    'bachata',
    'merengue',
    'clases de baile',
    'escuela de danza',
    'ritmos caribeños',
    'Córdoba',
    'Arguello',
    'Magui Arias',
    'Alma y Expresión',
    'baile',
    'reggaeton',
    'clases de salsa Tucumán',
  ],
  authors: [{ name: 'Alma & Expresión' }],
  creator: 'Alma & Expresión',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://www.almaexpresion.com',
    siteName: 'Alma & Expresión',
    title: 'Alma & Expresión - Escuela de Danzas y Ritmos Caribeños',
    description:
      'Descubrí la pasión del baile con nuestras clases de salsa, bachata, merengue y más. 14 años enseñando en Tucumán.',
    images: [
      {
        url: '/logo.png',
        width: 439,
        height: 500,
        alt: 'Alma & Expresión - Escuela de Danzas',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Alma & Expresión - Escuela de Danzas',
    description:
      'Clases de salsa, bachata, merengue y ritmos caribeños en Tucumán. ¡14 años de experiencia!',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.almaexpresion.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
