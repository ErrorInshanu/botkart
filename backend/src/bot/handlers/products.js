const Product = require('../../models/product');

const showProductsByCategory = async (ctx) => {
  try {
    const category = ctx.callbackQuery.data.replace('category_', '');

    const products = await Product.find({ category, inStock: true });

    await ctx.answerCbQuery();

    if (products.length === 0) {
      await ctx.reply(`😔 No products available in *${category}* right now!`, {
        parse_mode: 'Markdown',
      });
      return;
    }

    const categoryEmojis = {
      Drinks: '☕',
      Snacks: '🍟',
      Mains: '🍕',
      Desserts: '🍰',
    };

    const emoji = categoryEmojis[category] || '🍽️';

    await ctx.reply(`${emoji} *${category} Menu*\n\nHere's what we have:`, {
      parse_mode: 'Markdown',
    });

    // Send each product as a photo with caption and Add to Cart button
    for (const product of products) {
      const caption =
        `*${product.name}*\n` +
        `${product.description}\n\n` +
        `💰 *₹${product.price}*`;

      try {
        await ctx.replyWithPhoto(product.imageUrl, {
          caption,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `🛒 Add to Cart`,
                  callback_data: `add_to_cart_${product._id}`,
                },
              ],
            ],
          },
        });
      } catch (photoErr) {
        // If image fails to load, fall back to text
        await ctx.reply(caption, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `🛒 Add to Cart — ₹${product.price}`,
                  callback_data: `add_to_cart_${product._id}`,
                },
              ],
            ],
          },
        });
      }
    }

    // Navigation buttons at the end
    await ctx.reply('━━━━━━━━━━━━━━', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '◀️ Back to Categories', callback_data: 'show_categories' }],
          [{ text: '🏠 Main Menu', callback_data: 'main_menu' }],
        ],
      },
    });

  } catch (error) {
    console.error('Show products error:', error);
    await ctx.reply('❌ Something went wrong. Please try again!');
  }
};

module.exports = { showProductsByCategory };