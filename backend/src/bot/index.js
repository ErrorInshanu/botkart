const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Commands
bot.start(startCommand);

// Default handler for unknown messages
bot.on('text', async (ctx) => {
  await ctx.reply(
    'Use the menu below to navigate 👇',
    {
      reply_markup: {
        keyboard: [
          [{ text: '🛍️ Shop' }, { text: '📦 My Orders' }],
          [{ text: '💬 Support' }, { text: 'ℹ️ About' }],
        ],
        resize_keyboard: true,
        persistent: true,
      },
    }
  );
});

bot.launch();

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Telegram Bot is running ✅');

module.exports = bot;