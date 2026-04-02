/**
 * Утилита для логирования
 * В production логирует только ошибки, в development - все
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Логирование ошибок (всегда)
   */
  error: (message: string, ...args: any[]) => {
    if (typeof window !== 'undefined') {
      // Клиентская сторона - только в development
      if (isDevelopment) {
        console.error(`[ERROR] ${message}`, ...args);
      }
    } else {
      // Серверная сторона - всегда логируем ошибки
      console.error(`[ERROR] ${message}`, ...args);
    }
  },

  /**
   * Логирование предупреждений
   */
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      if (typeof window !== 'undefined') {
        console.warn(`[WARN] ${message}`, ...args);
      } else {
        console.warn(`[WARN] ${message}`, ...args);
      }
    }
  },

  /**
   * Логирование информации (только в development)
   */
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      if (typeof window !== 'undefined') {
        console.log(`[INFO] ${message}`, ...args);
      } else {
        console.log(`[INFO] ${message}`, ...args);
      }
    }
  },

  /**
   * Логирование отладки (только в development)
   */
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      if (typeof window !== 'undefined') {
        console.log(`[DEBUG] ${message}`, ...args);
      } else {
        console.log(`[DEBUG] ${message}`, ...args);
      }
    }
  },
};

