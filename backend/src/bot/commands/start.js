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
      `👋 Welcome to BotKart, ${firstName}!\n\n` +
      `🛍️ We bring the best products right to your Telegram.\n\n` +
      `Use the menu below to get started:`,
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
  } catch (error) {
    console.error('Start command error:', error);
    await ctx.reply('Something went wrong. Please try again!');
  }
};

module.exports = startCommand;