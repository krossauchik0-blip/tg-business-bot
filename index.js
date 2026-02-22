import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

// Токен берём из Railway Variables
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Твой Flowise endpoint
const FLOWISE_URL =
  "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd";

bot.on('message', async (msg) => {
  try {
    // Один и тот же sessionId для одного чата
    const sessionId = String(msg.chat.id);

    const response = await axios.post(FLOWISE_URL, {
      question: msg.text,
      overrideConfig: {
        sessionId: sessionId
      }
    });

    const reply =
      response.data?.text ||
      response.data?.answer ||
      "Нет ответа от AI";

    await bot.sendMessage(msg.chat.id, reply);

  } catch (error) {
    console.error("FLOWISE ERROR:", error.response?.data || error.message);
    await bot.sendMessage(msg.chat.id, "Ошибка AI");
  }
});

console.log("Telegram bot is running...");
