import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Верификация reCAPTCHA токена
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      // В development можно пропустить проверку
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({ success: true, score: 1.0 });
      }
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Верификация через Google API
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({
        success: false,
        error: data['error-codes'] || ['Verification failed'],
      });
    }

    // reCAPTCHA v3 возвращает score от 0.0 до 1.0
    // 1.0 = очень вероятно человек, 0.0 = очень вероятно бот
    const score = data.score || 0.5;
    const threshold = 0.5; // Порог для прохождения

    return NextResponse.json({
      success: score >= threshold,
      score,
      action: data.action,
    });
  } catch (error: any) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}

