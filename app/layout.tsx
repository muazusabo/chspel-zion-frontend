import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: {
    default: 'SAZU FCS — Fellowship of Christian Students',
    template: '%s | SAZU FCS',
  },
  description:
    'SAZU FCS is a university fellowship of Christian students growing in faith, building community, and serving with purpose.',
  openGraph: {
    title: 'SAZU FCS — Fellowship of Christian Students',
    description:
      'Growing in Faith. Building Community. Serving with Purpose.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
