# Шрифты брендбука ОСС

Как настроить и использовать шрифты SF UI Text и SF UI Display на сайте.

## Где разместить файлы

Поместите файлы шрифтов в папку `frontend/nextjs/public/fonts/`.

### SF UI Text
- `SFUITEXT-LIGHT (3).TTF` — Light (300)
- `SFUITEXT-REGULARITALIC.TTF` — Regular (400)
- `SFUITEXT-MEDIUM (3).TTF` — Medium (500)
- `SFUITEXT-SEMIBOLD (3).TTF` — Semibold (600)
- `SFUITEXT-BOLD (3).TTF` — Bold (700)
- `SFUITEXT-HEAVY (3).TTF` — Heavy (800)

### SF UI Display
- `SFUIDISPLAY-ULTRALIGHT (3).TTF` — Ultralight (100)
- `SFUIDISPLAY-THIN (3).TTF` — Thin (200)
- `SFUIDISPLAY-LIGHT (3).TTF` — Light (300)
- `SFUIDISPLAY-REGULAR (3).TTF` — Regular (400)
- `SFUIDISPLAY-MEDIUM (3).TTF` — Medium (500)
- `SFUIDISPLAY-SEMIBOLD (3).TTF` — Semibold (600)
- `SFUIDISPLAY-BOLD (3).TTF` — Bold (700)
- `SFUIDISPLAY-HEAVY (3).TTF` — Heavy (900)
- `SFUIDISPLAY-BLACK (3).TTF` — Black (950)

## Как это работает

Шрифты автоматически подключены в `globals.css` и применяются ко всему сайту:
- **SF UI Text** — для основного текста (body)
- **SF UI Display** — для заголовков (h1-h6)

### Tailwind классы

- `font-sf-text` — применить SF UI Text
- `font-sf-display` — применить SF UI Display

## Проверка

После размещения файлов:

1. Перезапустите dev сервер (`npm run dev`)
2. Откройте сайт в браузере
3. Проверьте в DevTools → Network, что шрифты загружаются
4. Проверьте в DevTools → Elements → Computed, что применяется правильный font-family

## Если шрифты не загружаются

- Убедитесь, что файлы находятся в `public/fonts/`
- Проверьте, что имена файлов точно соответствуют путям в CSS
- Очистите кэш браузера (Ctrl+Shift+R)
- Перезапустите dev сервер

## Fallback

Если файлы шрифтов не найдены, используются системные шрифты:
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

## Статус

✅ Все файлы шрифтов загружены  
✅ Пути в `globals.css` обновлены  
✅ Шрифты применяются автоматически

