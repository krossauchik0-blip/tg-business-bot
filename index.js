import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const FLOWISE_URL =
  "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd";

const bot = new TelegramBot(BOT_TOKEN);

app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
  try {
    const msg = req.body.message;
    if (!msg) return res.sendStatus(200);

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

    res.sendStatus(200);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
