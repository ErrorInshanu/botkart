const Product = require('../../models/product');

const catalogCommand = async (ctx) => {
  try {
    const products = await Product.find({ inStock: true });

    if (products.length === 0) {
      await ctx.reply('😔 No products available right now. Check back soon!');
      return;
    }

    // Get unique categories
    const categories = [...new Set(products.map((p) => p.category))];

    const categoryEmojis = {
      Food: '🍔',
      Drinks: '🥤',
      Clothing: '👕',
      Electronics: '📱',
      Beauty: '💄',
      Other: '📦',
    };

    let message = `🛍️ *Welcome to BotKart Store!*\n\n`;
    message += `✨ _Discover our amazing collection_\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📂 *Shop by Category:*\n\n`;

    categories.forEach((cat) => {
      const emoji = categoryEmojis[cat] || '📦';
      message += `${emoji} *${cat}*\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━`;

    const buttons = categories.map((cat) => {
      const emoji = categoryEmojis[cat] || '📦';
      return [{ text: `${emoji} ${cat}`, callback_data: `category_${cat}` }];
    });

    buttons.push([{ text: '🏠 Back to Menu', callback_data: 'main_menu' }]);

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (error) {
    console.error('Catalog command error:', error);
    await ctx.reply('❌ Something went wrong. Please try again!');
  }
};

module.exports = { showCategories: catalogCommand };
