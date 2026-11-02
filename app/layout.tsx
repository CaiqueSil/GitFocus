import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'gitfocus - Organize seus Objetivos de Estudo',
  description: 'Aplicação para desenvolvedores e equipes de tecnologia organizarem seus objetivos de estudo com foco, simplicidade e tema otimizado.',
  openGraph: {
    title: 'gitfocus - Organize seus Objetivos de Estudo',
    description: 'Aplicação para desenvolvedores e equipes de tecnologia organizarem seus objetivos de estudo com foco, simplicidade e tema otimizado.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gitfocus - Organize seus Objetivos de Estudo',
    description: 'Aplicação para desenvolvedores e equipes de tecnologia organizarem seus objetivos de estudo com foco, simplicidade e tema otimizado.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#121214] text-[#E1E1E6] antialiased selection:bg-[#64B5F6]/20 selection:text-[#64B5F6]"
      >
        {children}
      </body>
    </html>
  );
}
