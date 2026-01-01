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
  : `scan-errors-${new Date().toISOString().split('T')[0]}.${format}`;

// Проверка GitHub CLI
function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.error('❌ GitHub CLI (gh) не установлен');
    console.error('Установите: https://cli.github.com/');
    return false;
  }
}

// Получение информации о репозитории
function getRepoInfo() {
  try {
    const remote = execSync('git config --get remote.origin.url', { encoding: 'utf-8' }).trim();
    const match = remote.match(/github\.com[\/:]([\w\-\.]+)\/([\w\-\.]+)(?:\.git)?/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch (e) {
    console.error('❌ Не удалось определить репозиторий');
  }
  return null;
}

// Получение CodeQL alerts через GitHub API
async function getCodeQLAlerts(owner, repo) {
  console.log('🔍 Получение CodeQL alerts...');
  try {
    const result = execSync(
      `gh api repos/${owner}/${repo}/code-scanning/alerts --paginate`,
      { encoding: 'utf-8' }
    );
    const alerts = JSON.parse(result);
    return alerts.map(alert => ({
      type: 'CodeQL',
      severity: alert.rule?.severity || 'unknown',
      state: alert.state,
      rule: alert.rule?.name || 'unknown',
      message: alert.rule?.description || alert.message?.text || '',
      file: alert.most_recent_instance?.location?.path || '',
      line: alert.most_recent_instance?.location?.start_line || 0,
      created: alert.created_at,
      updated: alert.updated_at,
