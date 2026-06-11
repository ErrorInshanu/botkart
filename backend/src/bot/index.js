const { Telegraf } = require('telegraf');
const startCommand = require('./commands/start');
const { showCategories: catalogCommand } = require('./commands/catalog');
const { myOrders } = require('./commands/myorders');
const handleCallbacks = require('./handlers/callback');
const { handleMessage } = require('./handlers/message');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Attach io instance so handlers can emit socket events
const attachIO = (io) => {
  bot.telegram._io = io;
};

// Commands
bot.start(startCommand);

// Menu button handlers
bot.hears('🛍️ Shop', catalogCommand);
bot.hears('📦 My Orders', myOrders);

bot.hears('💬 Support', async (ctx) => {
  await ctx.reply(
    `💬 *Support*\n\n` +
    `Need help? We are here for you!\n\n` +
    `📧 Email: support@botkart.com\n` +
    `⏰ Available: 9AM - 9PM\n\n` +
    `_We usually reply within 1 hour_ ✨`,
    { parse_mode: 'Markdown' }
  );
});

bot.hears('ℹ️ About', async (ctx) => {
  await ctx.reply(
    `ℹ️ *About BotKart*\n\n` +
    `🛍️ BotKart is your personal shopping assistant on Telegram!\n\n` +
    `✨ *Why BotKart?*\n` +
    `• Shop without leaving Telegram\n` +
    `• AI powered smart assistant\n` +
    `• Fast delivery to your doorstep\n` +
    `• 100% secure payments\n\n` +
    `_Made with ❤️ for smart shoppers_`,
    { parse_mode: 'Markdown' }
  );
});

// Callback queries (inline button presses)
bot.on('callback_query', handleCallbacks);

// Free text — handles address capture (Day 5: Groq AI added here)
bot.on('text', handleMessage);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('Telegram Bot is running ✅');

module.exports = { bot, attachIO };