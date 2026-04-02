import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ОСС ДВФУ - Объединённый совет студентов ДВФУ',
    short_name: 'ОСС ДВФУ',
    description: 'Единое окно для обращений, гайдов и новостей ОСС ДВФУ',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#DC2626',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['education', 'government'],
    lang: 'ru',
    dir: 'ltr',
    orientation: 'portrait',
  };
}

