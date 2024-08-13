import TelegramBot from "node-telegram-bot-api";
import { readDatabase } from "../../../database/database.js";
import { middleware } from "./middleware.js";

export const getUsers = async (chatId: number, bot: TelegramBot) => {
  const isAuth = await middleware(chatId, bot);

  if (!isAuth) return;

  const database = await readDatabase();
  await bot.sendMessage(chatId, JSON.stringify(database));
};
