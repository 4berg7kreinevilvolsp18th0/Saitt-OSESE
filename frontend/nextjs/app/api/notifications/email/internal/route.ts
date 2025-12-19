import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appealId, type, title, message, url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Получаем email пользователя через Supabase Admin API
    // Требует service_role ключ в переменных окружения
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseServiceKey) {
      console.warn('SUPABASE_SERVICE_ROLE_KEY not set, cannot send email notifications');
      return NextResponse.json({ 
        success: false, 
        message: 'Email service not configured (missing service_role key)' 
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return NextResponse.json({ error: 'Supabase URL not configured' }, { status: 500 });
    }

    // Создаём клиент с service_role для доступа к auth.users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Получаем email пользователя
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !userData?.user?.email) {
      console.error('Error getting user email:', userError);
      return NextResponse.json({ error: 'User not found or email unavailable' }, { status: 404 });
    }

    const email = userData.user.email;

    const emailService = process.env.EMAIL_SERVICE || 'resend';
    const emailApiKey = process.env.EMAIL_API_KEY;

    if (!emailApiKey) {
