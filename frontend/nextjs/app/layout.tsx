import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oss-dvfu.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ОСС ДВФУ - Объединённый совет студентов ДВФУ',
    template: '%s | ОСС ДВФУ',
  },
  description:
    'Единое окно для обращений, гайдов и новостей ОСС ДВФУ. Решаем правовые, инфраструктурные, стипендиальные, адаптационные и консультационные вопросы студентов ДВФУ.',
  keywords: [
    'ОСС ДВФУ',
    'Объединённый совет студентов',
    'ДВФУ',
    'студенческое самоуправление',
    'обращения студентов',
    'помощь студентам',
  ],
  authors: [{ name: 'ОСС ДВФУ' }],
  creator: 'ОСС ДВФУ',
  publisher: 'ОСС ДВФУ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'ОСС ДВФУ',
    title: 'ОСС ДВФУ - Объединённый совет студентов ДВФУ',
    description:
      'Единое окно для обращений, гайдов и новостей ОСС ДВФУ. Решаем правовые, инфраструктурные, стипендиальные вопросы студентов.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ОСС ДВФУ',
    description: 'Единое окно для обращений, гайдов и новостей ОСС ДВФУ',
  },
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
  verification: {
    // Добавьте ваш Google Search Console verification code
    // google: 'your-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className="bg-oss-dark text-white antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
