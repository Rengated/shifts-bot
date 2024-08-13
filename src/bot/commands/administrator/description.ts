import TelegramBot from "node-telegram-bot-api";
import { middleware } from "./middleware.js";

export const description = async (chatId: number, bot: TelegramBot) => {
  const isAuth = await middleware(chatId, bot);
  if (isAuth) {
    await bot.sendMessage(
      chatId,
      "List admin commands: \n\n/getusers - to get all users in bot \n\n/adduser - to add users in bot for ex: /adduser 4433434:adnan \n\n/deleteuser - for user delete from bot ex /deleteuser 4433434 \n\n.xlsx file, that you upload will be downloaded and used like shifts list"
    );
  }
};
