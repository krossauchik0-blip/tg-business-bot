import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

console.log("🔥 NEW WEBHOOK VERSION STARTED 🔥");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const FLOWISE_URL =
  "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN not found");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN); // ❗ БЕЗ polling

// Проверка сервера
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// Webhook от Telegram
app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || !message.text) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const text = message.text;
    const sessionId = `tg_${chatId}`;

    console.log("📩 USER:", text);

    const flowiseResponse = await axios.post(FLOWISE_URL, {
      input: text,
      overrideConfig: {
        sessionId: sessionId
      }
    });

    console.log("🤖 FLOWISE:", flowiseResponse.data);

    const reply =
      flowiseResponse.data?.text ||
      flowiseResponse.data?.answer ||
      "Нет ответа от AI";

    await bot.sendMessage(chatId, reply);

    res.sendStatus(200);
  } catch (err) {
    console.error("🔥 ERROR:", err.response?.data || err.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
