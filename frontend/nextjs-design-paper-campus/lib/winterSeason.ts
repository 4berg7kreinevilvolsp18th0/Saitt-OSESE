/**
 * Календарная зима: декабрь, январь, февраль.
 */
export function isWinterCalendarMonth(date = new Date()): boolean {
  const m = date.getMonth();
  return m === 11 || m === 0 || m === 1;
}

/**
 * Зимняя тема и снежинки только в зимние месяцы.
 * Вне сезона всегда выключено (в т.ч. при winter-theme=true в localStorage).
 * В зиму: по умолчанию включено, явное выключение — winter-theme=false.
 */
export function shouldActivateWinterTheme(): boolean {
  if (typeof window === 'undefined') return false;
  if (!isWinterCalendarMonth()) return false;
  return localStorage.getItem('winter-theme') !== 'false';
}
