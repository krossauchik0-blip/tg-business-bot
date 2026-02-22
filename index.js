импортировать TelegramBot из 'node-telegram-bot-api';
импортирование аксиос из 'аксиос';

const bot = new TelegramBot(process.env.BOT_TOKEN, { пример: true });

bot.on('сообщение', асинхронный (сообщение) => {
 попробуй {
 константый ответ = ожидание axios.post(
 "https://cloud.flowiseai.com/api/v1/prediction/5ecfc67f-e2dd-4166-9a33-c00456cb64cd",
 { ввод: msg.text }
 );

 bot.sendMessage(msg.chat.id, response.data.text);
 } поймать (ошибка) {
 bot.sendMessage(msg.chat.id, "Ошибка ИИ");
  }
});
