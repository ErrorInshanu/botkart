const Product = require('../../models/product');

const showProductsByCategory = async (ctx) => {
  try {
    const category = ctx.callbackQuery.data.replace('category_', '');

    const products = await Product.find({ category, inStock: true });

    if (products.length === 0) {
      await ctx.answerCbQuery();
      await ctx.reply(`😔 No products available in *${category}* right now!`, {
        parse_mode: 'Markdown',
      });
      return;
    }

    const categoryEmojis = {
      Food: '🍔',
      Drinks: '🥤',
      Clothing: '👕',
      Electronics: '📱',
      Beauty: '💄',
      Other: '📦',
    };

    const emoji = categoryEmojis[category] || '📦';

    let message = `${emoji} *${category} Menu*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;

    products.forEach((product, index) => {
      message += `*${index + 1}. ${product.name}*\n`;
      message += `📝 ${product.description}\n`;
      message += `💰 *₹${product.price}*\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `_Tap any item to add to cart_ 🛒`;

    const buttons = products.map((product) => [
      {
        text: `🛒 ${product.name} — ₹${product.price}`,
        callback_data: `add_to_cart_${product._id}`,
      },
    ]);

    buttons.push([{ text: '◀️ Back to Categories', callback_data: 'show_categories' }]);
    buttons.push([{ text: '🏠 Main Menu', callback_data: 'main_menu' }]);

    await ctx.answerCbQuery();
    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (error) {
    console.error('Show products error:', error);
    await ctx.reply('❌ Something went wrong. Please try again!');
  }
};

module.exports = { showProductsByCategory };