#!/bin/bash

# Скрипт для экспорта всех ошибок из модулей сканирования GitHub
# 
# Использование:
#   ./scripts/export-scan-errors.sh [--format json|csv|txt] [--output file]
# 
# Требуется:
#   - GITHUB_TOKEN в переменных окружения
#   - GitHub CLI (gh) установлен и авторизован

set -e

# Параметры
FORMAT="${1:-json}"
OUTPUT="${2:-scan-errors-$(date +%Y-%m-%d).${FORMAT}}"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Начало экспорта ошибок сканирования...${NC}\n"

# Проверка GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) не установлен${NC}"
    echo "Установите: https://cli.github.com/"
    exit 1
fi

# Получение информации о репозитории
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo -e "${RED}❌ Не удалось определить репозиторий${NC}"
    exit 1
fi

echo -e "${GREEN}📦 Репозиторий: $REPO${NC}\n"

# Создаем временный файл для результатов
TEMP_DIR=$(mktemp -d)
TEMP_JSON="$TEMP_DIR/all_errors.json"

# Функция для получения CodeQL alerts
get_codeql_alerts() {
    echo -e "${YELLOW}🔍 Получение CodeQL alerts...${NC}"
    gh api repos/$REPO/code-scanning/alerts --paginate > "$TEMP_DIR/codeql.json" 2>/dev/null || echo "[]" > "$TEMP_DIR/codeql.json"
    COUNT=$(jq '. | length' "$TEMP_DIR/codeql.json")
    echo -e "   CodeQL: $COUNT alerts\n"
}

# Функция для получения workflow errors
get_workflow_errors() {
    echo -e "${YELLOW}🔍 Получение результатов workflow...${NC}"
    
    # Получаем список workflow
    gh api repos/$REPO/actions/workflows --paginate > "$TEMP_DIR/workflows.json" 2>/dev/null || echo '{"workflows":[]}' > "$TEMP_DIR/workflows.json"
    
    # Ищем нужные workflow
    WORKFLOWS=("Code Quality Check" "Security Audit" "Code Scanning" "Secret Scanning" "Super Linter")
    
    for WF_NAME in "${WORKFLOWS[@]}"; do
        WF_ID=$(jq -r ".workflows[] | select(.name == \"$WF_NAME\") | .id" "$TEMP_DIR/workflows.json")
        if [ -n "$WF_ID" ] && [ "$WF_ID" != "null" ]; then
            echo "   Проверка: $WF_NAME"
            gh api repos/$REPO/actions/workflows/$WF_ID/runs --paginate -f per_page=5 > "$TEMP_DIR/runs_$WF_ID.json" 2>/dev/null || echo '{"workflow_runs":[]}' > "$TEMP_DIR/runs_$WF_ID.json"
        fi
    done
    
    echo ""
}

# Функция для получения security advisories
get_security_advisories() {
    echo -e "${YELLOW}🔍 Получение security advisories...${NC}"
    gh api repos/$REPO/dependabot/alerts --paginate > "$TEMP_DIR/dependabot.json" 2>/dev/null || echo "[]" > "$TEMP_DIR/dependabot.json"
    COUNT=$(jq '. | length' "$TEMP_DIR/dependabot.json")
    echo -e "   Dependabot: $COUNT alerts\n"
}

# Собираем все данные
get_codeql_alerts
get_workflow_errors
get_security_advisories

# Объединяем все ошибки
jq -s 'flatten' "$TEMP_DIR/codeql.json" "$TEMP_DIR/dependabot.json" > "$TEMP_JSON" 2>/dev/null || echo "[]" > "$TEMP_JSON"

TOTAL=$(jq '. | length' "$TEMP_JSON")
echo -e "${GREEN}📊 Всего найдено ошибок: $TOTAL${NC}\n"

# Экспортируем в нужный формат
if [ "$TOTAL" -gt 0 ]; then
    case "$FORMAT" in
        csv)
            echo "Экспорт в CSV..."
            # Простой CSV экспорт
            jq -r '.[] | [.type, .severity, .state, .rule // .vulnerability // .message, .file, .line, .url] | @csv' "$TEMP_JSON" > "$OUTPUT"
            echo -e "${GREEN}✅ Экспортировано в $OUTPUT${NC}"
            ;;
        txt)
            echo "Экспорт в TXT..."
            {
                echo "=================================================================================="
                echo "ОТЧЕТ ОБ ОШИБКАХ СКАНИРОВАНИЯ КОДА"
                echo "=================================================================================="
                echo "Дата: $(date)"
                echo "Всего ошибок: $TOTAL"
                echo ""
                jq -r '.[] | "ТИП: \(.type // "Unknown")\nСерьезность: \(.severity // "unknown")\nСтатус: \(.state // "unknown")\nПравило: \(.rule // .vulnerability // .message // "N/A")\nФайл: \(.file // "N/A"):\(.line // 0)\nURL: \(.url // "N/A")\n---\n"' "$TEMP_JSON"
            } > "$OUTPUT"
            echo -e "${GREEN}✅ Экспортировано в $OUTPUT${NC}"
            ;;
        json|*)
            cp "$TEMP_JSON" "$OUTPUT"
            echo -e "${GREEN}✅ Экспортировано в $OUTPUT${NC}"
            ;;
    esac
else
    echo -e "${GREEN}✅ Ошибок не найдено!${NC}"
fi

# Очистка
rm -rf "$TEMP_DIR"

echo -e "\n${GREEN}✅ Готово!${NC}"

