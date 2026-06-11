const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// In-memory conversation history per user
const conversationHistory = new Map();

const SYSTEM_PROMPT = `You are BotKart's friendly shopping assistant for a small Telegram shop.

The shop sells:
- Food: Veg Burger (₹120), Paneer Roll (₹90)
- Drinks: Mango Lassi (₹60), Masala Chai (₹30)
- Clothing: Cotton T-Shirt (₹299), Denim Jacket (₹899)

Your job:
- Answer questions about products, prices, delivery
- Help customers decide what to buy
- Be friendly, short, and helpful
- Delivery takes 30-45 minutes
- Shop is open 9am to 9pm

Important rules:
- Keep replies short (2-3 lines max)
- Use emojis naturally
- If asked to place an order, tell them to use the Shop button
- Do not make up products that are not listed above`;

const getAIReply = async (telegramId, userMessage) => {
  try {
    // Get or create history for this user
    if (!conversationHistory.has(telegramId)) {
      conversationHistory.set(telegramId, []);
    }

    const history = conversationHistory.get(telegramId);

    // Add user message to history
    history.push({
      role: 'user',
      content: userMessage,
    });

    // Keep only last 10 messages to save memory
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    // Call Groq API
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiReply = response.choices[0].message.content;

    // Save assistant reply to history
    history.push({
      role: 'assistant',
      content: aiReply,
    });

    return aiReply;

  } catch (error) {
    console.error('Groq API error:', error.message);
    return '😅 I am having trouble thinking right now. Please use the menu buttons to shop!';
  }
};

module.exports = { getAIReply };