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
      url: alert.html_url
    }));
  } catch (e) {
    console.error('⚠️  Не удалось получить CodeQL alerts:', e.message);
    return [];
  }
}

// Получение результатов workflow runs
async function getWorkflowErrors(owner, repo) {
  console.log('🔍 Получение результатов workflow...');
  const workflows = [
    'Code Quality Check',
    'Security Audit',
    'Code Scanning',
    'Secret Scanning',
    'Super Linter'
  ];
  
  const errors = [];
  
  for (const workflowName of workflows) {
    try {
      const result = execSync(
        `gh api repos/${owner}/${repo}/actions/workflows --paginate`,
        { encoding: 'utf-8' }
      );
      const workflows = JSON.parse(result).workflows;
      const workflow = workflows.find(w => w.name === workflowName);
      
      if (workflow) {
        const runs = execSync(
          `gh api repos/${owner}/${repo}/actions/workflows/${workflow.id}/runs --paginate -f per_page=5`,
          { encoding: 'utf-8' }
        );
        const runsData = JSON.parse(runs);
        
        for (const run of runsData.workflow_runs || []) {
          if (run.conclusion === 'failure' || run.conclusion === 'cancelled') {
            // Получаем логи
            const jobs = execSync(
              `gh api repos/${owner}/${repo}/actions/runs/${run.id}/jobs`,
              { encoding: 'utf-8' }
            );
            const jobsData = JSON.parse(jobs);
            
            for (const job of jobsData.jobs || []) {
              if (job.conclusion === 'failure') {
                errors.push({
                  type: workflowName,
                  workflow: workflowName,
                  run_id: run.id,
                  status: run.conclusion,
                  created: run.created_at,
                  url: run.html_url,
                  job: job.name,
                  steps: job.steps?.filter(s => s.conclusion === 'failure').map(s => ({
                    name: s.name,
                    conclusion: s.conclusion
                  })) || []
                });
              }
            }
          }
        }
      }
    } catch (e) {
      `gh api repos/${owner}/${repo}/dependabot/alerts --paginate`,
      { encoding: 'utf-8' }
    );
    const alerts = JSON.parse(result);
    return alerts.map(alert => ({
      type: 'Dependabot',
      severity: alert.security_vulnerability?.severity || 'unknown',
      state: alert.state,
      package: alert.security_vulnerability?.package?.name || '',
      vulnerability: alert.security_vulnerability?.advisory?.summary || '',
      created: alert.created_at,
      updated: alert.updated_at,
      url: alert.html_url
    }));
  } catch (e) {
    console.error('⚠️  Не удалось получить security advisories:', e.message);
    return [];
  }
}

// Экспорт в JSON
function exportJSON(data, file) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ Экспортировано ${data.length} ошибок в ${file}`);
}

