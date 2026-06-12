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
bot.hears('🛍️ Menu', catalogCommand);
bot.hears('📦 My Orders', myOrders);

bot.hears('💬 Support', async (ctx) => {
  await ctx.reply(
    `💬 *Support*\n\n` +
    `Need help? We're here for you!\n\n` +
    `📧 Email: support@botkart.com\n` +
    `📱 WhatsApp: +91 98765 43210\n` +
    `⏰ Available: 10AM - 11PM\n\n` +
    `_We usually reply within 30 minutes_ ✨`,
    { parse_mode: 'Markdown' }
  );
});

bot.hears('ℹ️ About Us', async (ctx) => {
  await ctx.reply(
    `☕ *About The BotKart Cafe*\n\n` +
    `We serve freshly made food and drinks delivered straight to your door — all ordered right here on Telegram!\n\n` +
    `🍕 *What we offer:*\n` +
    `• Burgers, Pizzas & Mains\n` +
    `• Cold Coffees & Smoothies\n` +
    `• Crispy Snacks\n` +
    `• Desserts & more\n\n` +
    `⏰ *Hours:* 10 AM – 11 PM, Every Day\n` +
    `🚀 *Delivery:* 30–45 minutes\n\n` +
    `_Made with ❤️ for food lovers_`,
    { parse_mode: 'Markdown' }
  );
});

// Callback queries (inline button presses)
bot.on('callback_query', handleCallbacks);

// Free text — Groq AI + address capture
bot.on('text', handleMessage);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('🚀 The BotKart Cafe bot is running ✅');

module.exports = bot;