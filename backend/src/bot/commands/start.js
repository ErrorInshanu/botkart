const Customer = require('../../models/customer');

const startCommand = async (ctx) => {
  try {
    const telegramId = String(ctx.from.id);
    const firstName = ctx.from.first_name || 'Friend';
    const username = ctx.from.username || '';

    // Save or update customer in DB
    await Customer.findOneAndUpdate(
      { telegramId },
      { telegramId, firstName, username, lastSeen: Date.now() },
      { upsert: true, new: true }
    );

    await ctx.reply(
      `☕ Welcome to *The BotKart Cafe*, ${firstName}!\n\n` +
      `🍕 Burgers, Pizzas, Cold Coffees, Desserts — all delivered fresh to your door.\n\n` +
      `⏰ We're open *10 AM – 11 PM*, every day.\n\n` +
      `Tap *🛍️ Menu* to start ordering! 👇`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            [{ text: '🛍️ Menu' }, { text: '📦 My Orders' }],
            [{ text: '💬 Support' }, { text: 'ℹ️ About Us' }],
          ],
          resize_keyboard: true,
          persistent: true,
        },
      }
    );
  } catch (error) {
    console.error('Start command error:', error);
    await ctx.reply('Something went wrong. Please try again!');
  }
};

module.exports = startCommand;