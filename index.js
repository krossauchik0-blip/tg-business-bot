import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  try {
    const response = await axios.post(
      "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd",
      {
        input: msg.text
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          sessionId: msg.chat.id.toString()
        }
      }
    );

    bot.sendMessage(msg.chat.id, response.data.text);

  } catch (err) {
    console.error(err.response?.data || err.message);
    bot.sendMessage(msg.chat.id, "Ошибка AI");
  }
});
