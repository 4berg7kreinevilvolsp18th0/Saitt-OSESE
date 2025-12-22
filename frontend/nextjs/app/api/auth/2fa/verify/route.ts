import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { verify2FAToken, getUser2FASecret } from '../../../../lib/2fa';
import { supabase } from '../../../../lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * Верификация 2FA токена и включение 2FA
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token, enable } = body;

    if (!token) {
      return NextResponse.json(
