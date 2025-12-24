# Решение проблемы с установкой Supabase CLI через Scoop

## Проблема

При установке через Scoop возникает ошибка:
```
Failed to extract files from ...\supabase_windows_amd64.tar.gz
ERROR Exit code was 2!
```

## Быстрое решение ⭐

**Используйте npx - не требует установки!**

```powershell
# Вместо установки, просто используйте:
npx supabase@latest login
npx supabase@latest link --project-ref your-project-id
npx supabase@latest db push
```

Это работает сразу, без установки менеджеров пакетов!

---

## Альтернативные решения

### Решение 1: Попробовать Chocolatey

Если Scoop не работает, попробуйте Chocolatey:

```powershell
# Установите Chocolatey (от имени администратора)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установите Supabase CLI
choco install supabase
```

### Решение 2: Ручная установка

1. **Скачайте вручную:**
   - Перейдите на https://github.com/supabase/cli/releases
   - Найдите последний релиз (например, `v2.67.1`)
   - Скачайте `supabase_windows_amd64.zip` (НЕ tar.gz!)

2. **Распакуйте:**
   - Создайте папку `C:\Tools\supabase`
   - Распакуйте `supabase.exe` туда

3. **Добавьте в PATH:**
   ```powershell
   # Временно (для текущей сессии)
   $env:PATH += ";C:\Tools\supabase"
   
   # Постоянно (для всех сессий)
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Tools\supabase", "User")
   ```

4. **Проверка:**
   ```powershell
   supabase --version
   ```

### Решение 3: Исправить Scoop

Попробуйте обновить 7zip в Scoop:

```powershell
scoop update 7zip
scoop uninstall supabase
scoop install supabase
```

Или попробуйте установить из другого bucket:

```powershell
scoop install main/supabase
```

---

## Рекомендация

**Для вашего случая лучше всего использовать npx:**

```powershell
# Создайте алиас для удобства (опционально)
function supabase { npx supabase@latest $args }

# Теперь можно использовать просто:
supabase --version
supabase login
supabase link --project-ref your-project-id
supabase db push
```

Добавьте функцию в ваш PowerShell профиль, чтобы она работала всегда:

```powershell
# Откройте профиль
notepad $PROFILE

# Добавьте функцию
function supabase { npx supabase@latest $args }

# Сохраните и перезапустите PowerShell
```

---

## Итог

**Самый простой способ - использовать npx:**
- ✅ Не требует установки
- ✅ Работает сразу
- ✅ Всегда актуальная версия

**Или используйте Supabase Dashboard:**
- Все миграции можно выполнять через SQL Editor
- GitHub Actions автоматически применяет миграции
- CLI вообще не нужен!

