/**
 * Graceful Degradation (Плавная деградация) исправленная
 * Система продолжает работать с ограниченной функциональностью,даже если некоторые компоненты недоступны.
 */

import { serviceIsolation } from './serviceIsolation';

export type DegradationLevel = 'full' | 'degraded' | 'minimal' | 'offline';

interface DegradedFeature {
  name: string;
  available: boolean;
  fallback?: string;
  reason?: string;
}

class GracefulDegradationManager {
  /**
   * Проверить текущий уровень деградации системы
   */
  getDegradationLevel(): DegradationLevel {
    const health = serviceIsolation.getSystemHealth();

    if (health.healthy && !health.degraded) {
      return 'full';
    }

    if (health.healthy && health.degraded) {
      return 'degraded'; // Система работает, но некоторые функции недоступны
    }

    // Проверяем критичные сервисы
    const supabaseAvailable = serviceIsolation.isServiceAvailable('supabase');
    if (!supabaseAvailable) {
      return 'offline'; // Критичный сервис недоступен
    }

    return 'minimal'; // Работает только базовая функциональность
  }

  /**
   * Получить список доступных/недоступных функций
   */
  getAvailableFeatures(): DegradedFeature[] {
    const features: DegradedFeature[] = [
      {
        name: 'authentication',
        available: serviceIsolation.isServiceAvailable('supabase'),
        reason: serviceIsolation.isServiceAvailable('supabase')
          ? undefined
          : 'Supabase недоступен',
      },
      {
        name: 'appeals',
        available: serviceIsolation.isServiceAvailable('supabase'),
        reason: serviceIsolation.isServiceAvailable('supabase')
          ? undefined
          : 'База данных недоступна',
      },
      {
        name: 'notifications_telegram',
        available: serviceIsolation.isServiceAvailable('telegram'),
        fallback: 'notifications_email',
        reason: serviceIsolation.isServiceAvailable('telegram')
          ? undefined
          : 'Telegram API недоступен',
      },
      {
        name: 'notifications_email',
        available: serviceIsolation.isServiceAvailable('email'),
        reason: serviceIsolation.isServiceAvailable('email')
          ? undefined
          : 'Email сервис недоступен',
      },
      {
        name: 'rate_limiting',
        available: serviceIsolation.isServiceAvailable('redis'),
        fallback: 'local_rate_limiting',
        reason: serviceIsolation.isServiceAvailable('redis')
          ? undefined
          : 'Redis недоступен, используется локальное ограничение',
      },
    ];

    return features;
  }

  /**
   * Проверить, доступна ли конкретная функция
   */
  isFeatureAvailable(featureName: string): boolean {
    const features = this.getAvailableFeatures();
    const feature = features.find(f => f.name === featureName);
    return feature?.available ?? true; // По умолчанию доступна, если не найдена
  }

  /**
   * Получить fallback для функции
   */
  getFeatureFallback(featureName: string): string | undefined {
    const features = this.getAvailableFeatures();
    const feature = features.find(f => f.name === featureName);
    return feature?.fallback;
  }

  /**
   * Получить сообщение о текущем состоянии системы
   */
  getStatusMessage(): string {
    const level = this.getDegradationLevel();

    switch (level) {
      case 'full':
        return 'Все системы работают нормально';
      case 'degraded':
        return 'Система работает с ограниченной функциональностью';
      case 'minimal':
        return 'Доступна только базовая функциональность';
      case 'offline':
        return 'Система временно недоступна';
      default:
        return 'Неизвестное состояние';
    }
  }

  /**
   * Получить рекомендации для пользователя
   */
  getUserRecommendations(): string[] {
    const level = this.getDegradationLevel();
    const recommendations: string[] = [];

    if (level === 'offline') {
      recommendations.push(
        'Система временно недоступна. Пожалуйста, попробуйте позже.'
      );
      return recommendations;
    }

    if (level === 'minimal') {
      recommendations.push(
        'Доступна только базовая функциональность. Некоторые функции могут быть недоступны.'
      );
    }

    if (level === 'degraded') {
      const features = this.getAvailableFeatures();
      const unavailable = features.filter(f => !f.available);

      if (unavailable.length > 0) {
        recommendations.push(
          `Некоторые функции временно недоступны: ${unavailable.map(f => f.name).join(', ')}`
        );
      }
    }

    return recommendations;
  }
}

export const gracefulDegradation = new GracefulDegradationManager();

/**
 * Проверить доступность функции перед использованием
 */
export function requireFeature(featureName: string): boolean {
  return gracefulDegradation.isFeatureAvailable(featureName);
}

/**
 * Получить fallback функцию, если основная недоступна
 */
export function getFeatureFallback(featureName: string): string | undefined {
  return gracefulDegradation.getFeatureFallback(featureName);
}

/**
 * Обертка для выполнения функции с проверкой доступности
 */
export async function withFeatureCheck<T>(
  featureName: string,
  fn: () => Promise<T>,
  fallback: () => Promise<T> | T
): Promise<T> {
  if (gracefulDegradation.isFeatureAvailable(featureName)) {
    try {
      return await fn();
    } catch (error) {
      console.warn(
        `[GracefulDegradation] Feature ${featureName} failed, using fallback:`,
        error
      );
      return await Promise.resolve(fallback());
    }
  }

  const fallbackFeature = gracefulDegradation.getFeatureFallback(featureName);
  if (fallbackFeature && gracefulDegradation.isFeatureAvailable(fallbackFeature)) {
    console.log(
      `[GracefulDegradation] Feature ${featureName} unavailable, using ${fallbackFeature}`
    );
  }

  return await Promise.resolve(fallback());
}



