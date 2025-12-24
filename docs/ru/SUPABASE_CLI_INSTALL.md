# Установка Supabase CLI на Windows

## ⚠️ Важно

**Supabase CLI НЕЛЬЗЯ устанавливать через `npm install -g`!**

Ошибка, которую вы видите:
```
Installing Supabase CLI as a global module is not supported.
Please use one of the supported package managers
```

## ✅ Правильные способы установки

### Вариант 1: Scoop (может иметь проблемы с распаковкой)

**⚠️ Известная проблема:** Scoop может не распаковать tar.gz архив. Если возникла ошибка распаковки, используйте другие варианты.

#### Шаг 1: Установка Scoop

Откройте PowerShell (от имени администратора НЕ требуется):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

#### Шаг 2: Установка Supabase CLI

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Если возникла ошибка распаковки:**
- Используйте Вариант 2 (Chocolatey) или Вариант 3 (ручная установка)
- Или используйте Вариант 4 (npx) - не требует установки

#### Шаг 3: Проверка

```powershell
supabase --version
```

Должно показать версию, например: `supabase version 1.x.x`

---

### Вариант 2: Chocolatey (Рекомендуется, если Scoop не работает) ⭐

Chocolatey - еще один популярный менеджер пакетов для Windows.

#### Шаг 1: Установка Chocolatey

Откройте PowerShell (от имени администратора):

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

#### Шаг 2: Установка Supabase CLI

```powershell
choco install supabase
```

#### Шаг 3: Проверка

```powershell
supabase --version
```

---

### Вариант 3: Ручная установка

Если Scoop и Chocolatey недоступны:

1. **Скачайте последнюю версию:**
   - Перейдите на https://github.com/supabase/cli/releases
   - Найдите последний релиз (например, `v1.x.x`)
   - Скачайте `supabase_windows_amd64.zip` (или `supabase_windows_arm64.zip` для ARM)

2. **Распакуйте архив:**
   - Создайте папку, например `C:\Tools\supabase`
   - Распакуйте туда файл `supabase.exe`

3. **Добавьте в PATH:**
   - Откройте "Параметры системы" → "Дополнительные параметры системы"
   - Нажмите "Переменные среды"
   - В "Системные переменные" найдите `Path`
   - Нажмите "Изменить" → "Создать"
   - Добавьте путь: `C:\Tools\supabase`
   - Нажмите "ОК" везде

4. **Проверка:**
   - Закройте и откройте PowerShell заново
   - Выполните: `supabase --version`

---

### Вариант 4: Использование npx (без установки) ⭐ РЕКОМЕНДУЕТСЯ

**Самый простой способ!** Не требует установки менеджеров пакетов.

```powershell
# Проверка версии
npx supabase@latest --version

# Вход в Supabase
npx supabase@latest login

# Связывание проекта
npx supabase@latest link --project-ref your-project-id

# Применение миграций
npx supabase@latest db push
```

**Плюсы:**
- ✅ Не требует установки Scoop/Chocolatey
- ✅ Работает сразу
- ✅ Всегда последняя версия

**Минусы:**
- ⚠️ Медленнее (скачивает CLI каждый раз, ~30 секунд)
- ⚠️ Требует интернет-соединение

**Для вашего случая это лучший вариант!**

---

## Использование после установки

### 1. Вход в Supabase

```powershell
supabase login
```

Откроется браузер для авторизации.

### 2. Связывание проекта

```powershell
supabase link --project-ref your-project-id
```

Где `your-project-id` - это Reference ID из Supabase Dashboard → Settings → General.

### 3. Применение миграций

```powershell
# Перейдите в папку проекта
cd "C:\Users\Kreig\Saitt OSESE"

# Примените миграции
supabase db push
```

---

## Решение проблем

### Проблема: "supabase: command not found"

**Решение:**
1. Убедитесь, что CLI установлен: `scoop list` или `choco list`
2. Перезапустите PowerShell
3. Проверьте PATH: `$env:PATH`

### Проблема: "Execution policy"

**Решение:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Проблема: Scoop не устанавливается

**Решение:**
1. Убедитесь, что PowerShell 5.1 или новее: `$PSVersionTable.PSVersion`
2. Попробуйте установить вручную: https://scoop.sh

### Проблема: Chocolatey требует админ-права

**Решение:**
- Запустите PowerShell от имени администратора
- Или используйте Scoop (не требует админ-прав)

---

## Альтернатива: Использование только Supabase Dashboard

Если установка CLI вызывает проблемы, можно использовать только Supabase Dashboard:

1. Все миграции выполняются через SQL Editor
2. GitHub Actions автоматически применяет миграции
3. CLI не требуется для работы проекта

---

## Рекомендация

**Для вашего случая:**
- Используйте **Scoop** (самый простой способ)
- Или просто используйте **Supabase Dashboard** + **GitHub Actions** (CLI не нужен)

CLI нужен только если вы хотите тестировать миграции локально перед коммитом.

