import { NextResponse } from 'next/server';

// Простой тестовый endpoint для проверки работы API routes
export async function GET() {
  return NextResponse.json({
    message: 'API работает!',
    timestamp: new Date().toISOString(),
    path: '/api/test',
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

