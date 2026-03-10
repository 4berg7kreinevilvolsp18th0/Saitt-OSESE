import { NextResponse } from 'next/server';
import { serviceIsolation } from '../../../../lib/serviceIsolation';
import { gracefulDegradation } from '../../../../lib/gracefulDegradation';
import { getAllComponentStates } from '../../../../lib/circuitBreaker';
import RenderFromTemplateContext from 'next/dist/client/components/render-from-template-context';

/**
 * Расширенный health check с информацией о статусе всех запущенных компонентов
 * Показывает состояние изоляции и деградации запущенных компонентов
 */
export async function GET() {
  try {
    const systemHealth = serviceIsolation.getSystemHealth();
    const degradationLevel = gracefulDegradation.getDegradationLevel();
    const features = gracefulDegradation.getAvailableFeatures();
    const circuitBreakerStates = getAllComponentStates();

    return NextResponse.json({
      status: systemHealth.healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      system: {
        health: systemHealth.healthy,
        degraded: systemHealth.degraded,
        degradationLevel,
        message: gracefulDegradation.getStatusMessage(),
        recommendations: gracefulDegradation.getUserRecommendations(),
      },
      services: systemHealth.services.map(service => ({
        name: service.name,
        healthy: service.healthy,
        available: service.available,
        lastCheck: new Date(service.lastCheck).toISOString(),
        error: service.error || null,
      })),
      features: features.map(feature => ({
        name: feature.name,
        available: feature.available,
        fallback: feature.fallback || null,
        reason: feature.reason || null,
      })),
      circuitBreakers: Object.entries(circuitBreakerStates).map(([name, state]) => ({
        name,
        state,
      })),
      environment: process.env.NODE_ENV,
    }, {
      status: systemHealth.healthy ? 200 : 503, // 503 Service Unavailable если система деградировала и не может функционировать
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error in health check status',
      error: error.message || 'Unknown error in health check status',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}


