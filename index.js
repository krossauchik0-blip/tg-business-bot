import express from "express";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";

const app = express();
app.use(express.json());

// ====== НАСТРОЙКИ ======
const BOT_TOKEN = process.env.BOT_TOKEN;
const FLOWISE_URL =
  "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN);

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.status(200).send("Bot is running");
});

// ====== TELEGRAM WEBHOOK ======
app.post(`/bot${BOT_TOKEN}`, async (req, res) => {
  try {
    const msg = req.body.message;

    if (!msg || !msg.text) {
      return res.sendStatus(200);
    }

    const chatId = msg.chat.id;
    const userText = msg.text;
    const sessionId = `tg_${chatId}`;

    console.log("📩 USER:", userText);

    // ====== ЗАПРОС В FLOWISE ======
    const flowiseResponse = await axios.post(
      FLOWISE_URL,
      {
        input: userText,
        overrideConfig: {
          sessionId: sessionId
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    console.log("🤖 FLOWISE RAW:", flowiseResponse.data);

    const reply =
      flowiseResponse.data?.text ||
      flowiseResponse.data?.answer ||
      "Нет ответа от AI";

    await bot.sendMessage(chatId, reply);

    res.sendStatus(200);
  } catch (error) {
    console.error("🔥 ERROR:", error.response?.data || error.message);
    res.sendStatus(200);
  }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
