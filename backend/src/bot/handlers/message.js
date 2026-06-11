const cartService = require('../../services/cartService');
const { confirmOrder } = require('./order');
const { getAIReply } = require('../../services/groqService');

const handleMessage = async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const text = ctx.message.text;

  // Priority 1: check if user is in checkout flow
  if (cartService.isAwaitingAddress(telegramId)) {
    return await confirmOrder(ctx, text);
  }

  // Priority 2: ignore menu button texts
  const menuButtons = ['🛍️ Shop', '📦 My Orders', '💬 Support', 'ℹ️ About'];
  if (menuButtons.includes(text)) return;

  // Priority 3: Groq AI handles everything else
  try {
    await ctx.sendChatAction('typing'); // shows "typing..." in Telegram
    const aiReply = await getAIReply(telegramId, text);
    await ctx.reply(aiReply);
  } catch (error) {
    console.error('Message handler error:', error.message);
    await ctx.reply('😅 Something went wrong. Please try again!');
  }
};

module.exports = { handleMessage };