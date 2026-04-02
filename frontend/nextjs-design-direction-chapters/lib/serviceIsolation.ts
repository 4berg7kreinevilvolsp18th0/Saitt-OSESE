/**
 * Service Isolation Pattern
 * 
 * Изоляция сервисов: при атаке на один компонент сервиса остальные продолжают работать
 * 
 * Принципы:
 * 1. Каждый сервис работает независимо и имеет свой fallback
 * 2. Ошибка в одном компоненте сервиса не должна влиять на другие компоненты сервиса
 * 3. Используются fallback механизмы для каждого компонента сервиса
 * 4. Graceful degradation - система работает даже при недоступности некоторых компонентов сервиса
 */

import { getAllComponentStates, getCircuitBreaker } from './circuitBreaker';

export interface ServiceStatus {
  name: string;
  healthy: boolean;
  available: boolean;
  lastCheck: number;
  error?: string;
}

class ServiceIsolationManager {
  private services: Map<string, ServiceStatus> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 30000; // 30 секунд - интервал проверки доступности компонентов сервиса для graceful degradation

  constructor() {
    // Инициализируем компоненты сервиса
    this.initializeServices();
  }

  private initializeServices() {
    const services: string[] = ['supabase', 'telegram', 'email', 'redis'];
    services.forEach(service => {
      this.services.set(service, {
        name: service,
        healthy: true,
        available: true,
        lastCheck: Date.now(),
      });
    });
  }

  /**
   * Получить статус компонента сервиса
   */
  getServiceStatus(serviceName: string): ServiceStatus | null {
    return this.services.get(serviceName) || null;
  }

  /**
   * Обновить статус компонента сервиса
   */
  updateServiceStatus(
    serviceName: string,
    healthy: boolean,
    error?: string
  ): void {
    const current = this.services.get(serviceName);
    if (current) {
      current.healthy = healthy;
      current.available = healthy; // Можно сделать более сложную логику для определения доступности компонента сервиса
      current.lastCheck = Date.now();
      if (error) {
        current.error = error;
      } else {
        delete current.error;
      }
      this.services.set(serviceName, current);
    }
  }

  /**
   * Проверить, доступен ли компонент сервиса
   */
  isServiceAvailable(serviceName: string): boolean {
    const status = this.services.get(serviceName);
    if (!status) return true; // Если компонент сервиса не зарегистрирован, считаем доступным

    // Проверяем circuit breaker
    const breakerState = getAllComponentStates()[serviceName];
    if (breakerState === 'OPEN') {
      return false;
    }

    return status.available && status.healthy;
  }

  /**
   * Выполнить функцию с изоляцией (не выбрасывает ошибку, возвращает fallback)
   */
  async executeIsolated<T>(
    serviceName: string,
    fn: () => Promise<T>,
    fallback: T
  ): Promise<T> {
    if (!this.isServiceAvailable(serviceName)) {
      console.warn(`[ServiceIsolation] Service ${serviceName} is not available, using fallback`);
      return fallback;
    }

    try {
      const result = await fn();
      this.updateServiceStatus(serviceName, true);
      return result;
    } catch (error: any) {
      console.error(`[ServiceIsolation] Error in service ${serviceName}:`, error);
      this.updateServiceStatus(serviceName, false, error.message);
      return fallback;
    }
  }

  /**
   * Получить все статусы компонентов сервиса
   */
  getAllStatuses(): ServiceStatus[] {
    return Array.from(this.services.values());
  }

  /**
   * Сбросить статус компонента сервиса (для тестов или ручного восстановления)
   */
  resetService(serviceName: string): void {
    getCircuitBreaker(serviceName).reset();
    this.updateServiceStatus(serviceName, true);
  }

  /**
   * Получить здоровье системы (все критичные компоненты сервиса работают)
   */
  getSystemHealth(): {
    healthy: boolean;
    services: ServiceStatus[];
    degraded: boolean;
  } {
    const services = Array.from(this.services.values());
    const criticalServices = ['supabase']; // Критичные сервисы
    const criticalHealthy = criticalServices.every(
      name => this.isServiceAvailable(name)
    );
    
    const allHealthy = services.every(s => s.healthy);
    const degraded = !allHealthy && criticalHealthy; // Система работает, но некоторые функции недоступны

    return {
      healthy: criticalHealthy,
      services,
      degraded,
    };
  }
}

// Глобальный менеджер изоляции компонентов сервиса
export const serviceIsolation = new ServiceIsolationManager();

/**
 * Обертка для изолированного выполнения функции компонента сервиса
 */
export async function withIsolation<T>(
  serviceName: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  return serviceIsolation.executeIsolated(serviceName, fn, fallback);
}

/**
 * Проверить доступность компонента сервиса перед выполнением
 */
export function requireComponentAvailability(serviceName: string): boolean {
  return serviceIsolation.isServiceAvailable(serviceName);
}



