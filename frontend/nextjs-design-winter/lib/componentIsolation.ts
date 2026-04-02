/**
 * Система изоляции компонентов
 * 
 * Принцип: при атаке на один компонент все остальные продолжают работать
 * Каждый компонент изолирован и имеет свой fallback
 */

import { executeWithCircuitBreaker, isComponentAvailable } from './circuitBreaker';

export type ComponentName = 
  | 'database'
  | 'redis'
  | 'email'
  | 'telegram'
  | 'captcha'
  | '2fa'
  | 'file-upload'
  | 'notifications'
  | 'analytics';

/**
 * Конфигурация изоляции для каждого компонента
 */
interface ComponentConfig {
  name: ComponentName;
  fallbackEnabled: boolean;
  fallbackValue?: any;
  timeout?: number;
}

/**
 * Выполнить операцию с изоляцией компонента
 */
export async function executeIsolated<T>(
  componentName: ComponentName,
  operation: () => Promise<T>,
  fallback?: () => Promise<T> | T,
  options?: { timeout?: number }
): Promise<T> {
  try {
    // Проверяем доступность компонента
    if (!isComponentAvailable(componentName)) {
      console.warn(`[Isolation] Компонент ${componentName} недоступен, используем fallback`);
      if (fallback) {
        return await Promise.resolve(fallback());
      }
      throw new Error(`Component ${componentName} is unavailable`);
    }

    // Выполняем через Circuit Breaker
    return await executeWithCircuitBreaker(
      componentName,
      operation,
      fallback,
      { timeout: options?.timeout || 10000 }
    );
  } catch (error: any) {
    console.error(`[Isolation] Ошибка в компоненте ${componentName}:`, error);
    
    // Всегда возвращаем fallback если доступен
    if (fallback) {
      console.log(`[Isolation] Используем fallback для ${componentName}`);
      return await Promise.resolve(fallback());
    }
    
    throw error;
  }
}

/**
 * Безопасное выполнение операций с базой данных
 */
export async function safeDatabaseOperation<T>(
  operation: () => Promise<T>,
  fallback?: () => Promise<T> | T
): Promise<T> {
  return executeIsolated('database', operation, fallback, { timeout: 15000 });
}

/**
 * Безопасное выполнение операций с Redis
 */
export async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallback?: () => Promise<T> | T
): Promise<T> {
  return executeIsolated('redis', operation, fallback, { timeout: 5000 });
}

/**
 * Безопасная отправка email
 */
export async function safeEmailSend(
  operation: () => Promise<boolean>,
  fallback?: () => Promise<boolean> | boolean
): Promise<boolean> {
  return executeIsolated('email', operation, fallback || (() => false), { timeout: 10000 });
}

/**
 * Безопасная отправка Telegram уведомлений
 */
export async function safeTelegramSend(
  operation: () => Promise<boolean>,
  fallback?: () => Promise<boolean> | boolean
): Promise<boolean> {
  return executeIsolated('telegram', operation, fallback || (() => false), { timeout: 10000 });
}

/**
 * Безопасная проверка CAPTCHA
 */
export async function safeCaptchaVerify(
  operation: () => Promise<boolean>,
  fallback?: () => Promise<boolean> | boolean
): Promise<boolean> {
  // Для CAPTCHA fallback = true (разрешаем, если CAPTCHA недоступна)
  // Это предотвращает блокировку легитимных пользователей
  return executeIsolated('captcha', operation, fallback || (() => true), { timeout: 5000 });
}

/**
 * Безопасная загрузка файлов
 */
export async function safeFileUpload<T>(
  operation: () => Promise<T>,
  fallback?: () => Promise<T> | T
): Promise<T> {
  return executeIsolated('file-upload', operation, fallback, { timeout: 30000 });
}

/**
 * Проверить доступность компонента
 */
export function checkComponentHealth(componentName: ComponentName): {
  available: boolean;
  state: string;
} {
  const available = isComponentAvailable(componentName);
  return {
    available,
    state: available ? 'healthy' : 'unavailable',
  };
}

/**
 * Получить статус всех компонентов
 */
export function getAllComponentsHealth(): Record<ComponentName, { available: boolean; state: string }> {
  const components: ComponentName[] = [
    'database',
    'redis',
    'email',
    'telegram',
    'captcha',
    '2fa',
    'file-upload',
    'notifications',
    'analytics',
  ];

  const health: Record<string, { available: boolean; state: string }> = {};
  
  components.forEach(component => {
    health[component] = checkComponentHealth(component);
  });

  return health as Record<ComponentName, { available: boolean; state: string }>;
}

/**
 * Graceful degradation: система работает даже при недоступности некоторых компонентов
 */
export class ComponentIsolationManager {
  private static instance: ComponentIsolationManager;

  static getInstance(): ComponentIsolationManager {
    if (!ComponentIsolationManager.instance) {
      ComponentIsolationManager.instance = new ComponentIsolationManager();
    }
    return ComponentIsolationManager.instance;
  }

  /**
   * Проверить, может ли система работать с текущим состоянием компонентов
   */
  canSystemOperate(): {
    canOperate: boolean;
    criticalComponentsDown: ComponentName[];
    warnings: string[];
  } {
    const health = getAllComponentsHealth();
    const criticalComponents: ComponentName[] = ['database'];
    const importantComponents: ComponentName[] = ['redis', 'captcha'];
    
    const criticalDown = criticalComponents.filter(
      comp => !health[comp].available
    );
    const importantDown = importantComponents.filter(
      comp => !health[comp].available
    );

    const warnings: string[] = [];
    
    if (importantDown.length > 0) {
      warnings.push(
        `Важные компоненты недоступны: ${importantDown.join(', ')}. Система работает в ограниченном режиме.`
      );
    }

    return {
      canOperate: criticalDown.length === 0, // Система работает, если база данных доступна
      criticalComponentsDown: criticalDown,
      warnings,
    };
  }
}



