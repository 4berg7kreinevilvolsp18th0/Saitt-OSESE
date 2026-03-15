# Как получить информацию об ошибках сканирования

## 📋 Обзор

В проекте настроено более 7 модулей сканирования кода, которые могут находить сотни ошибок. Этот документ объясняет, как получить полную информацию обо всех найденных ошибках.

---

## 🔍 Где смотреть ошибки

### 1. GitHub Security Tab

**Путь:** `https://github.com/OWNER/REPO/security`

#### CodeQL Alerts
- **Security** → **Code scanning alerts**
- Показывает все уязвимости, найденные CodeQL
- Можно фильтровать по серьезности, статусу, языку
- Можно экспортировать в CSV

#### Dependabot Alerts
- **Security** → **Dependabot alerts**
- Показывает уязвимости в зависимостях
- Можно фильтровать по пакету, серьезности, статусу
- Можно экспортировать в CSV

#### Secret Scanning
- **Security** → **Secret scanning**
- Показывает найденные секреты в коде
- Автоматически блокирует коммиты с секретами

---

### 2. GitHub Actions

**Путь:** `https://github.com/OWNER/REPO/actions`

#### Просмотр результатов workflow

1. Перейдите в **Actions**
2. Выберите нужный workflow:
   - **Code Quality Check** - ошибки линтера и типов
   - **Security Audit** - уязвимости зависимостей
   - **Code Scanning** - комплексное сканирование
   - **Secret Scanning** - поиск секретов
   - **Super Linter** - ошибки линтинга всех файлов
   - **CodeQL Security Analysis** - анализ уязвимостей

3. Откройте последний run
4. Просмотрите логи каждого шага

#### Скачивание артефактов

Некоторые workflow сохраняют артефакты:
- **Security Audit** - сохраняет JSON отчет
- **Code Quality** - может сохранять результаты линтера

**Как скачать:**
1. Откройте нужный workflow run
2. Прокрутите вниз до секции **Artifacts**
3. Нажмите на артефакт для скачивания

---

### 3. GitHub CLI (gh)

#### Установка GitHub CLI

**Windows:**
```powershell
winget install GitHub.cli
```

**Linux:**
```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**macOS:**
```bash
brew install gh
```

#### Авторизация

```bash
gh auth login
```

#### Получение CodeQL alerts

```bash
# Все alerts
gh api repos/OWNER/REPO/code-scanning/alerts --paginate

# Только открытые
gh api repos/OWNER/REPO/code-scanning/alerts --paginate -f state=open

# Экспорт в JSON
gh api repos/OWNER/REPO/code-scanning/alerts --paginate > codeql-alerts.json

# Экспорт в CSV (требуется jq)
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq -r '.[] | [.rule.severity, .state, .rule.name, .most_recent_instance.location.path, .most_recent_instance.location.start_line, .html_url] | @csv' > codeql-alerts.csv
```

#### Получение Dependabot alerts

```bash
# Все alerts
gh api repos/OWNER/REPO/dependabot/alerts --paginate

# Только открытые
gh api repos/OWNER/REPO/dependabot/alerts --paginate -f state=open

# Экспорт в JSON
gh api repos/OWNER/REPO/dependabot/alerts --paginate > dependabot-alerts.json

# Экспорт в CSV
gh api repos/OWNER/REPO/dependabot/alerts --paginate | \
  jq -r '.[] | [.security_vulnerability.severity, .state, .security_vulnerability.package.name, .security_vulnerability.advisory.summary, .html_url] | @csv' > dependabot-alerts.csv
```

#### Получение результатов workflow

```bash
# Список всех workflow
gh api repos/OWNER/REPO/actions/workflows --paginate

# Последние runs конкретного workflow
gh api repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/runs --paginate -f per_page=10

# Логи конкретного run
gh run view RUN_ID --log

# Список всех failed runs
gh run list --workflow=WORKFLOW_NAME --status=failure --limit=50
```

---

### 4. Автоматические скрипты

В проекте есть скрипты для автоматического экспорта всех ошибок:

#### Node.js скрипт

```bash
# Установка зависимостей (если нужно)
npm install

# Запуск скрипта
node scripts/export-scan-errors.js

# С параметрами
node scripts/export-scan-errors.js --format csv --output my-errors.csv
node scripts/export-scan-errors.js --format txt --output my-errors.txt
node scripts/export-scan-errors.js --format json --output my-errors.json
```

#### Bash скрипт

```bash
# Сделать исполняемым
chmod +x scripts/export-scan-errors.sh

# Запуск
./scripts/export-scan-errors.sh json scan-errors.json
./scripts/export-scan-errors.sh csv scan-errors.csv
./scripts/export-scan-errors.sh txt scan-errors.txt
```

**Что делает скрипт:**
- ✅ Получает все CodeQL alerts
- ✅ Получает все Dependabot alerts
- ✅ Получает ошибки из всех workflow runs
- ✅ Объединяет все в один файл
- ✅ Экспортирует в JSON, CSV или TXT

---

## 📊 Анализ большого количества ошибок

### Фильтрация по серьезности

**CodeQL:**
```bash
# Только критичные
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq '.[] | select(.rule.severity == "error")'

# Только высокие
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq '.[] | select(.rule.severity == "error" or .rule.severity == "warning")'
```

**Dependabot:**
```bash
# Только критичные
gh api repos/OWNER/REPO/dependabot/alerts --paginate | \
  jq '.[] | select(.security_vulnerability.severity == "critical")'
```

### Группировка по типу

```bash
# Группировка CodeQL alerts по правилу
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq 'group_by(.rule.name) | map({rule: .[0].rule.name, count: length, alerts: .})'

# Группировка Dependabot по пакету
gh api repos/OWNER/REPO/dependabot/alerts --paginate | \
  jq 'group_by(.security_vulnerability.package.name) | map({package: .[0].security_vulnerability.package.name, count: length})'
```

### Статистика

```bash
# Общая статистика CodeQL
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq '{
    total: length,
    by_severity: group_by(.rule.severity) | map({severity: .[0].rule.severity, count: length}),
    by_state: group_by(.state) | map({state: .[0].state, count: length})
  }'

# Общая статистика Dependabot
gh api repos/OWNER/REPO/dependabot/alerts --paginate | \
  jq '{
    total: length,
    by_severity: group_by(.security_vulnerability.severity) | map({severity: .[0].security_vulnerability.severity, count: length}),
    by_state: group_by(.state) | map({state: .[0].state, count: length})
  }'
```

---

## 🔧 Улучшение workflow для лучшего экспорта

Все workflow уже настроены для сохранения результатов. Но можно улучшить:

### Добавление артефактов

В каждом workflow можно добавить шаг для сохранения результатов:

```yaml
- name: Upload scan results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: scan-results
    path: scan-results.json
    retention-days: 30
```

### Добавление summary

Все workflow уже генерируют summary, который виден в GitHub Actions UI.

---

## 📈 Мониторинг ошибок

### GitHub Actions Badges

Можно добавить badges в README для отображения статуса:

```markdown
![CodeQL](https://github.com/OWNER/REPO/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Security Audit](https://github.com/OWNER/REPO/workflows/Security%20Audit/badge.svg)
```

### Уведомления

GitHub автоматически отправляет уведомления при:
- Обнаружении критичных уязвимостей
- Обнаружении секретов в коде
- Неудачных workflow runs (если настроено)

---

## 🚨 Приоритизация исправлений

### 1. Критичные уязвимости безопасности
- CodeQL alerts с severity: `error`
- Dependabot alerts с severity: `critical`
- Secret scanning alerts

### 2. Высокие уязвимости
- CodeQL alerts с severity: `warning`
- Dependabot alerts с severity: `high`

### 3. Проблемы качества кода
- ESLint errors
- TypeScript errors
- Super Linter errors

### 4. Предупреждения
- ESLint warnings
- CodeQL alerts с severity: `note`

---

## 📚 Полезные команды

### Быстрый просмотр всех ошибок

```bash
# Все CodeQL alerts (кратко)
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq -r '.[] | "\(.rule.severity) | \(.state) | \(.rule.name) | \(.most_recent_instance.location.path):\(.most_recent_instance.location.start_line)"'

# Все Dependabot alerts (кратко)
gh api repos/OWNER/REPO/dependabot/alerts --paginate | \
  jq -r '.[] | "\(.security_vulnerability.severity) | \(.state) | \(.security_vulnerability.package.name)"'

# Все failed workflow runs
gh run list --status=failure --limit=20
```

### Экспорт для анализа

```bash
# Полный экспорт всех ошибок
node scripts/export-scan-errors.js --format json --output all-errors.json

# Только критичные в CSV
gh api repos/OWNER/REPO/code-scanning/alerts --paginate | \
  jq -r '.[] | select(.rule.severity == "error") | [.rule.severity, .state, .rule.name, .most_recent_instance.location.path, .most_recent_instance.location.start_line, .html_url] | @csv' > critical-errors.csv
```

---

## ✅ Чек-лист

- [ ] Установлен GitHub CLI (`gh`)
- [ ] Авторизован в GitHub CLI (`gh auth login`)
- [ ] Знаю, где смотреть CodeQL alerts (Security → Code scanning)
- [ ] Знаю, где смотреть Dependabot alerts (Security → Dependabot)
- [ ] Знаю, где смотреть результаты workflow (Actions)
- [ ] Могу экспортировать ошибки через скрипты
- [ ] Понимаю приоритеты исправления ошибок

---

**Теперь вы знаете, как получить информацию обо всех ошибках сканирования!** 🔍

