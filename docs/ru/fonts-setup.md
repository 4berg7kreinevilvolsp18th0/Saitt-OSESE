# Настройка шрифтов брендбука ОСС

## Размещение файлов шрифтов

Поместите файлы шрифтов в папку `frontend/nextjs/public/fonts/`:

### SF UI Text
- `SFUITEXT-LIGHT.TTF` (300)
- `SFUITEXT-REGULAR.TTF` (400) - если есть
- `SFUITEXT-MEDIUM.TTF` (500)
- `SFUITEXT-SEMIBOLD.TTF` (600)
- `SFUITEXT-BOLD.TTF` (700)

### SF UI Display
- `SFUIDISPLAY-ULTRALIGHT.TTF` (100)
- `SFUIDISPLAY-THIN.TTF` (200)
- `SFUIDISPLAY-REGULAR.TTF` (400) - если есть
- `SFUIDISPLAY-MEDIUM.TTF` (500)
- `SFUIDISPLAY-SEMIBOLD.TTF` (600)
- `SFUIDISPLAY-BOLD.TTF` (700)
- `SFUIDISPLAY-HEAVY.TTF` (900)

## Использование

Шрифты автоматически подключены в `globals.css` и применяются ко всему сайту:

- **SF UI Text** - для основного текста (body)
- **SF UI Display** - для заголовков (h1-h6)

### Tailwind классы

- `font-sf-text` - применить SF UI Text
- `font-sf-display` - применить SF UI Display

## Проверка

После размещения файлов:
1. Перезапустите dev сервер (`npm run dev`)
2. Проверьте в DevTools → Network, что шрифты загружаются
3. Проверьте в DevTools → Elements, что применяется правильный font-family

## Fallback

Если файлы шрифтов не найдены, используются системные шрифты:
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

