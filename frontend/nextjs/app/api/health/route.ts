import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '../../../lib/supabaseClient';
import { getAllComponentsHealth, ComponentIsolationManager } from '../../../lib/componentIsolation';

// Явно указываем runtime для Vercel (nodejs для работы с импортами)
export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabaseConfigured = isSupabaseConfigured();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Проверка состояния всех компонентов
    const componentsHealth = getAllComponentsHealth();
    const systemStatus = ComponentIsolationManager.getInstance().canSystemOperate();

    return NextResponse.json({
      status: systemStatus.canOperate ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      system: {
        canOperate: systemStatus.canOperate,
        criticalComponentsDown: systemStatus.criticalComponentsDown,
        warnings: systemStatus.warnings,
      },
      components: componentsHealth,
      supabase: {
        configured: supabaseConfigured,
        url: supabaseUrl ? (supabaseUrl.substring(0, 20) + '...') : 'not set',
        key: supabaseKey ? (supabaseKey.substring(0, 10) + '...') : 'not set',
      },
      environment: process.env.NODE_ENV,
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
      },
    }, {
      status: systemStatus.canOperate ? 200 : 503, // 503 если система в деградированном режиме
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}
