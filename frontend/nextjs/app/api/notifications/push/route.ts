import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appealId, type, title, message, url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Получаем настройки уведомлений пользователя
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('push_enabled, push_subscription, push_appeal_status, push_appeal_assigned, push_appeal_comment')
      .eq('user_id', userId)
      .single();

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    if (!settings.push_enabled || !settings.push_subscription) {
