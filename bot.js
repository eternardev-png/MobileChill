const TelegramBot = require('node-telegram-bot-api');

// Replace with your Telegram Bot Token from @BotFather
// You can also use environment variables: process.env.BOT_TOKEN
const token = '7867875109:AAHH_1mGhQ2DldQMsF4X7YeJ144XpHe7t5M';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// URL to your Vercel App
// REPLACE THIS with your actual Vercel URL
const webAppUrl = 'https://mobile-chill.vercel.app';

// Listen for '/start' command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Grower';

    // Send a message with an inline button that opens the Web App
    const message = `Привет, ${firstName}! 🌳 Добро пожаловать в MobileChill!

🎮 **Как играть:**
1. **Тапай** по дереву, чтобы добывать Энергию и растить его.
2. **Покупай улучшения** за Монеты, чтобы добывать больше.
3. **Выполняй квесты**, чтобы получать Семена (нужны для открытия новых деревьев).

✨ **Престиж:**
Когда накопишь достаточно Энергии, ты сможешь сделать **Престиж**.
Это сбросит твой прогресс (дерево и обычные улучшения), НО:
💎 Ты получишь **Осколки Престижа**.
🚀 За них покупаются **Вечные Улучшения**, которые остаются навсегда!

Готов вырастить самое большое дерево? Жми кнопку ниже! 👇`;

    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🎮 Играть', web_app: { url: webAppUrl } }
                ]
            ]
        }
    });
});

console.log('Bot is running...');
