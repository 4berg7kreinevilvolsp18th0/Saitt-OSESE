/**
 * Валидация паролей с проверкой сложности
 */

const WEAK_PASSWORDS = [
  'password', '12345678', 'qwerty', 'admin', 'password123',
  '123456789', 'qwerty123', 'admin123', 'letmein', 'welcome',
  'monkey', '1234567', '123456', 'password1', 'qwertyuiop',
];

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  // Проверка длины
  if (password.length < 8) {
    errors.push('Пароль должен быть не менее 8 символов');
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Проверка на заглавные буквы
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  } else {
    score += 1;
  }

  // Проверка на строчные буквы
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву');
  } else {
    score += 1;
  }

  // Проверка на цифры
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  } else {
    score += 1;
  }

  // Проверка на специальные символы
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/_+\-=~`]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ (!@#$%^&* и т.д.)');
  } else {
    score += 1;
  }

  // Проверка на слабые пароли
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Этот пароль слишком простой и часто используется');
  } else {
    score += 1;
  }

  // Проверка на повторяющиеся символы
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Пароль не должен содержать более 3 одинаковых символов подряд');
  } else {
    score += 1;
  }

  // Определение силы пароля
  if (score >= 6 && password.length >= 12) {
    strength = 'strong';
  } else if (score >= 4) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

