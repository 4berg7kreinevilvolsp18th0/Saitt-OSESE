import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken } from '../../../lib/csrf';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Получить CSRF токен для формы
 */
export async function GET(request: NextRequest) {
  try {
    const token = generateCSRFToken();
    
    // Сохранить токен в httpOnly cookie
    const response = NextResponse.json({ token });
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 час
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

