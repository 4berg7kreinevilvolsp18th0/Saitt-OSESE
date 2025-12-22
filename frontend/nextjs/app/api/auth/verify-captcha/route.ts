import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Верификация reCAPTCHA токена
 */
export async function POST(request: NextRequest) {
