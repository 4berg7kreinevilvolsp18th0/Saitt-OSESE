# Сканирование кода на GitHub

## 🔍 Обзор

Проект использует несколько инструментов для автоматического сканирования кода на GitHub:

1. **CodeQL** - анализ кода на уязвимости
2. **Security Audit** - проверка зависимостей
3. **Code Quality** - проверка качества кода
4. **Secret Scanning** - поиск секретов
5. **Dependency Review** - проверка зависимостей в PR
6. **Super Linter** - линтинг всех файлов

---

## 📋 Workflow файлы

### 1. CodeQL (`codeql.yml`)

**Что делает:**
- Анализирует код на уязвимости безопасности
- Проверяет JavaScript/TypeScript и GitHub Actions
- Использует расширенные запросы безопасности

**Когда запускается:**
- При push в `main`/`master`
- При создании Pull Request
- Каждый вторник в 5:25 UTC (по расписанию)
- Вручную через `workflow_dispatch`

**Результаты:**
- Отображаются в **Security** → **Code scanning alerts**
- Автоматически создаются issues для критических проблем

---

### 2. Security Audit (`security-audit.yml`)

**Что делает:**
- Проверяет зависимости на известные уязвимости
- Использует `npm audit`
- Создает отчеты в JSON

**Когда запускается:**
- При push в `main`/`master`
- При создании Pull Request
- Каждый понедельник в 6:00 UTC
- Вручную через `workflow_dispatch`

**Результаты:**
- Показывает количество критических/высоких уязвимостей
- Сохраняет отчет как артефакт
- Не прерывает сборку, только предупреждает

---

### 3. Code Quality (`code-quality.yml`)

**Что делает:**
- Запускает ESLint
- Проверяет TypeScript типы
- Ищет `console.log` в продакшн коде
- Проверяет безопасность кода

**Когда запускается:**
- При push в `main`/`master`/`develop`
- При создании Pull Request
- Вручную через `workflow_dispatch`

**Результаты:**
- Показывает ошибки линтера
- Показывает ошибки типов
- Предупреждает о проблемах безопасности

---

### 4. Secret Scanning (`secret-scanning.yml`)

**Что делает:**
- Использует Gitleaks для поиска секретов
- Проверяет на hardcoded пароли, ключи, токены
- Сканирует весь репозиторий

**Когда запускается:**
- При push в `main`/`master`/`develop`
- При создании Pull Request
- Вручную через `workflow_dispatch`

**Результаты:**
- Блокирует коммиты с секретами
- Показывает найденные паттерны
- Рекомендует использовать переменные окружения

---

### 5. Code Scanning (`code-scanning.yml`)

**Что делает:**
- Комплексное сканирование кода
- Проверка на анти-паттерны безопасности
- Проверка на SQL injection
- Проверка на открытые учетные данные

**Когда запускается:**
- При push в `main`/`master`
- При создании Pull Request
- Каждый понедельник в 8:00 UTC
- Вручную через `workflow_dispatch`

**Результаты:**
- Показывает все найденные проблемы
- Генерирует summary отчет

---

### 6. Dependency Review (`dependency-review.yml`)

**Что делает:**
- Проверяет новые зависимости в Pull Request
- Предупреждает о проблемах безопасности
- Проверяет лицензии

**Когда запускается:**
- Только при создании Pull Request

**Результаты:**
- Показывает информацию о новых зависимостях
- Предупреждает о проблемах безопасности
- Блокирует PR с проблемными зависимостями

---

### 7. Super Linter (`super-linter.yml`)

**Что делает:**
- Линтит все типы файлов:
  - TypeScript/JavaScript
  - JSON, YAML
  - Markdown
  - CSS
  - Bash
  - Python
  - SQL
  - Dockerfile
  - .env файлы

**Когда запускается:**
- При push в `main`/`master`/`develop`
- При создании Pull Request
- Вручную через `workflow_dispatch`

**Результаты:**
- Показывает ошибки линтинга для всех файлов
- Автоматически исправляет некоторые проблемы

---

## 🔧 Настройка

### Включение сканирования

Все workflow уже настроены и работают автоматически. Ничего дополнительно настраивать не нужно.

### Просмотр результатов

1. **CodeQL результаты:**
   - GitHub → **Security** → **Code scanning alerts**

2. **Security Audit:**
   - GitHub → **Actions** → **Security Audit**
   - Проверьте артефакты для детального отчета

3. **Code Quality:**
   - GitHub → **Actions** → **Code Quality Check**
   - Проверьте логи каждого шага
   - Скачайте артефакт `code-quality-results` для детального отчета

4. **Secret Scanning:**
   - GitHub → **Actions** → **Secret Scanning**
   - Проверьте результаты Gitleaks

5. **Code Scanning:**
   - GitHub → **Actions** → **Code Scanning**
   - Скачайте артефакт `code-scanning-results` для детального отчета

6. **Super Linter:**
   - GitHub → **Actions** → **Super Linter**
   - Скачайте артефакт `super-linter-results` для детального отчета

> 📖 **Подробная инструкция:** См. [Как получить информацию об ошибках сканирования](./HOW_TO_GET_SCAN_ERRORS.md) для получения всех ошибок (включая экспорт через скрипты и GitHub CLI)

---

## 🚨 Что делать при обнаружении проблем

### Критические уязвимости

1. **CodeQL нашел уязвимость:**
   - Перейдите в **Security** → **Code scanning alerts**
   - Изучите детали уязвимости
   - Исправьте код согласно рекомендациям
   - Закоммитьте исправление

2. **Security Audit нашел уязвимости:**
   - Проверьте отчет в артефактах
   - Обновите зависимости: `npm audit fix`
   - Или обновите конкретную зависимость

3. **Secret Scanning нашел секреты:**
   - Немедленно удалите секреты из кода
   - Смените скомпрометированные ключи
   - Используйте GitHub Secrets или переменные окружения

---

## 📊 Статистика

### Регулярные проверки

- **CodeQL:** Каждый вторник в 5:25 UTC
- **Security Audit:** Каждый понедельник в 6:00 UTC
- **Code Scanning:** Каждый понедельник в 8:00 UTC

### При каждом PR

- CodeQL
- Security Audit
- Code Quality
- Secret Scanning
- Dependency Review
- Super Linter

---

## 🔐 Безопасность

### Что проверяется

- ✅ Уязвимости в зависимостях
- ✅ Проблемы безопасности в коде
- ✅ Hardcoded секреты
- ✅ Анти-паттерны безопасности
- ✅ SQL injection риски
- ✅ XSS риски
- ✅ Качество кода

### Что НЕ проверяется автоматически

- ⚠️ Ручное тестирование безопасности
- ⚠️ Penetration testing
- ⚠️ Социальная инженерия

---

## 📚 Дополнительные ресурсы

- [GitHub Code Scanning](https://docs.github.com/en/code-security/code-scanning)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

---

## ✅ Чек-лист

- [x] CodeQL настроен
- [x] Security Audit настроен
- [x] Code Quality проверки настроены
- [x] Secret Scanning настроен
- [x] Dependency Review настроен
- [x] Super Linter настроен
- [x] Все workflow работают автоматически

---

**Все модули сканирования подключены и работают!** 🔍

