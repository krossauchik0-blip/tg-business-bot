import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

console.log("🚀 GROQ BOT STARTED 🚀");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!BOT_TOKEN || !GROQ_API_KEY) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  try {
    if (!msg.text) return;

    console.log("📩 USER:", msg.text);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "Ты профессиональный бизнес-консультант. Отвечай кратко, четко и по делу."
          },
          {
            role: "user",
            content: msg.text
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content ||
      "Нет ответа";

    await bot.sendMessage(msg.chat.id, reply);
  } catch (err) {
    console.error("🔥 ERROR:", err.response?.data || err.message);
  }
});
