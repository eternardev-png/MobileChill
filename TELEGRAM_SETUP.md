# Инструкция по настройке Telegram Mini App для MobileChill

## Шаг 1: Создать Telegram бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Введите имя бота: `MobileChill`
   - Введите username: `mobilechill_bot` (или другое доступное имя)
4. Сохраните **токен бота** (понадобится для будущих апдейтов)

## Шаг 2: Создать Web App

1. В чате с [@BotFather](https://t.me/botfather) отправьте команду `/newapp`
2. Выберите вашего бота из списка
3. Введите данные приложения:
   - **Title**: MobileChill
   - **Description**: Grow your virtual tree and collect energy!
   - **Photo**: Загрузите иконку 640x360px (можете создать через AI или использовать скриншот)
   - **Demo GIF/Video**: (опционально) короткое демо вашей игры
   - **Short name**: `mobilechill` (будет использоваться в URL)

4. **Web App URL**: Здесь нужно вставить URL вашего деплоя на Vercel
   - Сначала развертываем на Vercel (см. Шаг 3)
   - Затем возвращаемся сюда и вставляем URL

## Шаг 3: Deploy на Vercel

### A. Через GitHub (рекомендуется)

1. Убедитесь, что ваш код загружен на GitHub (уже сделано ✅)
2. Перейдите на [vercel.com](https://vercel.com)
3. Зарегистрируйтесь или войдите через GitHub
4. Нажмите **"Add New Project"**
5. Выберите репозиторий `eternardev-png/MobileChill`
6. Настройки проекта:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
7. Нажмите **Deploy**
8. Дождитесь завершения деплоя
9. Скопируйте ваш **Production URL** (например: `https://mobile-chill.vercel.app`)

### B. Через CLI (альтернатива)

```bash
# Установите Vercel CLI
npm i -g vercel

# В папке проекта выполните
vercel

# Следуйте инструкциям
# При первом деплое выберите:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: mobilechill
# - In which directory is your code located: ./
# - Override settings: Yes
#   - Build Command: npm run build:web
#   - Output Directory: web-build
```

## Шаг 4: Обновить Web App URL

1. Вернитесь к [@BotFather](https://t.me/botfather)
2. Отправьте `/myapps`
3. Выберите ваше приложение
4. Выберите **"Edit Web App URL"**
5. Вставьте ваш Vercel URL (например: `https://mobile-chill.vercel.app`)

## Шаг 5: Тестирование

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку **меню** (☰) внизу
3. Выберите ваше приложение
4. Приложение должно открыться внутри Telegram!

### Проверьте:
- ✅ Haptic feedback работает при нажатии на кнопки
- ✅ Тема адаптируется под Telegram (светлая/темная)
- ✅ Данные сохраняются в Cloud Storage
- ✅ Прогресс сохраняется между сессиями

## Шаг 6: Добавить в меню бота

Чтобы пользователи могли легко открыть игру:

1. В [@BotFather](https://t.me/botfather) отправьте `/mybots`
2. Выберите вашего бота
3. Выберите **"Bot Settings"** → **"Menu Button"**
4. Выберите ваше Web App
5. Теперь у бота будет кнопка для запуска игры!

## Дополнительно: Custom Domain (опционально)

Если хотите использовать свой домен вместо `vercel.app`:

1. В Vercel перейдите в **Settings** → **Domains**
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel
4. Обновите URL в [@BotFather](https://t.me/botfather)

## Обновление приложения

При внесении изменений в код:

1. Сделайте `git push` в ваш GitHub репозиторий
2. Vercel автоматически пересоберет и задеплоит новую версию
3. Изменения появятся в Telegram в течение нескольких минут

## Troubleshooting

### Проблема: Приложение не открывается
- Проверьте, что URL в BotFather начинается с `https://`
- Убедитесь, что Vercel deploy завершился успешно

### Проблема: Данные не сохраняются
- Cloud Storage работает только внутри Telegram
- При тестировании в браузере используется fallback на localStorage

### Проблема: Haptic feedback не работает
- Haptic feedback работает только на мобильных устройствах
- Протестируйте на телефоне в Telegram

## Полезные ссылки

- [Telegram Bot API Docs](https://core.telegram.org/bots/webapps)
- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
