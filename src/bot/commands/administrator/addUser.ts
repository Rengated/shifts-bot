import TelegramBot from "node-telegram-bot-api";
import { createRecord } from "../../../database/database.js";
import { middleware } from "./middleware.js";

export const addUser = async (chatId: number, bot: TelegramBot, newUser: string[]) => {
  const isAuth = await middleware(chatId, bot);

  if (!isAuth) return;

  if (!(newUser?.length === 2)) {
    return await bot.sendMessage(chatId, "Provide a valid user, ex tgid:username");
  }

  const [userId, sheetsName] = newUser;
  await createRecord(String(userId), sheetsName);
  await bot.sendMessage(chatId, `User: ${sheetsName} saved with tgId: ${userId}`);
};
