import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'gitfocus - Organize seus Objetivos de Estudo',
  description: 'Aplicação para estudantes e desenvolvedores de tecnologia organizarem seus objetivos de estudo com foco e simplicidade.',
  openGraph: {
    title: 'gitfocus - Organize seus Objetivos de Estudo',
    description: 'Aplicação para estudantes e desenvolvedores de tecnologia organizarem seus objetivos de estudo com foco e simplicidade.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gitfocus - Organize seus Objetivos de Estudo',
    description: 'Aplicação para estudantes e desenvolvedores de tecnologia organizarem seus objetivos de estudo com foco e simplicidade.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
