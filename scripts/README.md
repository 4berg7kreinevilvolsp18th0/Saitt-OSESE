# Скрипты для работы с проектом

## 📋 Экспорт ошибок сканирования

### Node.js скрипт

Экспортирует все ошибки из модулей сканирования GitHub в один файл.

**Требования:**
- Node.js установлен
- GitHub CLI (`gh`) установлен и авторизован

**Использование:**

```bash
# Экспорт в JSON (по умолчанию)
node scripts/export-scan-errors.js

# Экспорт в CSV
node scripts/export-scan-errors.js --format csv --output errors.csv

# Экспорт в TXT
node scripts/export-scan-errors.js --format txt --output errors.txt
```

**Что экспортируется:**
- ✅ CodeQL alerts
- ✅ Dependabot alerts
- ✅ Ошибки из workflow runs
- ✅ Security advisories

### Bash скрипт

Альтернативная версия на bash.

**Требования:**
- Bash
- GitHub CLI (`gh`) установлен и авторизован
- `jq` для обработки JSON

**Использование:**

```bash
# Сделать исполняемым (первый раз)
chmod +x scripts/export-scan-errors.sh

# Экспорт в JSON
./scripts/export-scan-errors.sh json errors.json

# Экспорт в CSV
./scripts/export-scan-errors.sh csv errors.csv

# Экспорт в TXT
./scripts/export-scan-errors.sh txt errors.txt
```

---

## 📚 Дополнительная документация

Подробная инструкция: [`docs/ru/HOW_TO_GET_SCAN_ERRORS.md`](../docs/ru/HOW_TO_GET_SCAN_ERRORS.md)

