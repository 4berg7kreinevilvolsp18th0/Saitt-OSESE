#!/usr/bin/env node

/**
 * Скрипт для экспорта всех ошибок из модулей сканирования GitHub
 * 
 * Использование:
 *   node scripts/export-scan-errors.js [--format json|csv|txt] [--output file]
 * 
 * Требуется:
 *   - GITHUB_TOKEN в переменных окружения
 *   - GitHub CLI (gh) установлен и авторизован
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Параметры командной строки
const args = process.argv.slice(2);
const format = args.includes('--format') 
  ? args[args.indexOf('--format') + 1] || 'json'
  : 'json';
const outputFile = args.includes('--output')
  ? args[args.indexOf('--output') + 1]
