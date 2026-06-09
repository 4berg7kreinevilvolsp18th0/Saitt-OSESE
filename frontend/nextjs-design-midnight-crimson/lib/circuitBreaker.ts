/**
 * Circuit Breaker Pattern для изоляции компонентов
 * 
 * Принцип: если один компонент атакован или не работает,
 * остальные компоненты продолжают работать независимо
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  failureThreshold: number; // Количество ошибок до открытия
  resetTimeout: number; // Время до попытки восстановления (мс)
  successThreshold: number; // Успешных запросов для закрытия (HALF_OPEN -> CLOSED)
  timeout: number; // Таймаут запроса (мс)
}

export interface CircuitBreakerStats {
  failures: number;
  successes: number;
  state: CircuitState;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5, // 5 ошибок подряд
  resetTimeout: 60000, // 60 секунд
  successThreshold: 2, // 2 успешных запроса
  timeout: 10000, // 10 секунд
};

class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private stats: CircuitBreakerStats;
  private name: string;

  constructor(name: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.name = name;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.stats = {
      failures: 0,
      successes: 0,
      state: 'CLOSED',
      lastFailureTime: null,
      lastSuccessTime: null,
    };
  }

  /**
   * Выполнить функцию через Circuit Breaker
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T> | T
  ): Promise<T> {
    // Проверка состояния
    if (this.stats.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - (this.stats.lastFailureTime || 0);
      
      if (timeSinceLastFailure >= this.config.resetTimeout) {
        // Переход в HALF_OPEN для тестирования
        this.stats.state = 'HALF_OPEN';
        this.stats.failures = 0;
        this.stats.successes = 0;
        console.log(`[CircuitBreaker:${this.name}] Переход в HALF_OPEN`);
      } else {
        // Circuit открыт, используем fallback
        console.warn(`[CircuitBreaker:${this.name}] Circuit OPEN, используем fallback`);
        if (fallback) {
          return await Promise.resolve(fallback());
        }
        throw new Error(`Circuit breaker ${this.name} is OPEN`);
      }
    }

    try {
      // Выполняем функцию с таймаутом
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.config.timeout)
        ),
      ]);

      // Успешное выполнение
      this.onSuccess();
      return result;
    } catch (error) {
      // Ошибка выполнения
      this.onFailure();
      
      // Используем fallback если доступен
      if (fallback) {
        console.warn(`[CircuitBreaker:${this.name}] Ошибка, используем fallback:`, error);
        return await Promise.resolve(fallback());
      }
      
      throw error;
    }
  }

  private onSuccess(): void {
    this.stats.successes++;
    this.stats.failures = 0;
    this.stats.lastSuccessTime = Date.now();

    if (this.stats.state === 'HALF_OPEN') {
      if (this.stats.successes >= this.config.successThreshold) {
        // Переход в CLOSED
        this.stats.state = 'CLOSED';
        this.stats.successes = 0;
        console.log(`[CircuitBreaker:${this.name}] Переход в CLOSED`);
      }
    }
  }

  private onFailure(): void {
    this.stats.failures++;
    this.stats.lastFailureTime = Date.now();

    if (this.stats.failures >= this.config.failureThreshold) {
      // Переход в OPEN
      this.stats.state = 'OPEN';
      console.error(`[CircuitBreaker:${this.name}] Переход в OPEN после ${this.stats.failures} ошибок`);
    }
  }

  /**
   * Получить текущее состояние
   */
  getState(): CircuitState {
    return this.stats.state;
  }

  /**
   * Получить статистику
   */
  getStats(): CircuitBreakerStats {
    return { ...this.stats };
  }

  /**
   * Сбросить состояние (для тестирования)
   */
  reset(): void {
    this.stats = {
      failures: 0,
      successes: 0,
      state: 'CLOSED',
      lastFailureTime: null,
      lastSuccessTime: null,
    };
  }
}

// Глобальные Circuit Breakers для каждого компонента
const circuitBreakers = new Map<string, CircuitBreaker>();

/**
 * Получить или создать Circuit Breaker для компонента
 */
export function getCircuitBreaker(
  componentName: string,
  config?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  if (!circuitBreakers.has(componentName)) {
    circuitBreakers.set(componentName, new CircuitBreaker(componentName, config));
  }
  return circuitBreakers.get(componentName)!;
}

/**
 * Выполнить функцию через Circuit Breaker компонента
 */
export async function executeWithCircuitBreaker<T>(
  componentName: string,
  fn: () => Promise<T>,
  fallback?: () => Promise<T> | T,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  const breaker = getCircuitBreaker(componentName, config);
  return breaker.execute(fn, fallback);
}

/**
 * Проверить, доступен ли компонент
 */
export function isComponentAvailable(componentName: string): boolean {
  const breaker = circuitBreakers.get(componentName);
  if (!breaker) return true; // Если нет breaker, считаем доступным
  return breaker.getState() !== 'OPEN';
}

/**
 * Получить состояние всех компонентов
 */
export function getAllComponentStates(): Record<string, CircuitState> {
  const states: Record<string, CircuitState> = {};
  circuitBreakers.forEach((breaker, name) => {
    states[name] = breaker.getState();
  });
  return states;
}



