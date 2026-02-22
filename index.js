import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const FLOWISE_URL =
  "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd";

bot.on('message', async (msg) => {
  try {
    const sessionId = String(msg.chat.id);

    const response = await axios.post(FLOWISE_URL, {
      input: msg.text,
      overrideConfig: {
        sessionId: sessionId
      }
    });

    const reply =
      response.data?.text ||
      response.data?.answer ||
      "Нет ответа";

    await bot.sendMessage(msg.chat.id, reply);

  } catch (error) {
    console.error(error.response?.data || error.message);
    await bot.sendMessage(msg.chat.id, "Ошибка AI");
  }
});

console.log("Bot running...");
