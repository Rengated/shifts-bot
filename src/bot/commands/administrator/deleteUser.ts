import TelegramBot from "node-telegram-bot-api";
import { deleteRecord } from "../../../database/database.js";
import { middleware } from "./middleware.js";

export const deleteUser = async (chatId: number, userId: number, bot: TelegramBot) => {
  const isAuth = await middleware(chatId, bot);

  if (!isAuth) return;

  if (!userId) {
    return await bot.sendMessage(chatId, "Send valid userId to delete in format /deleteuser {userid}");
  }
  const isDeleteSuccess = await deleteRecord(String(userId));

  if (isDeleteSuccess) {
    return await bot.sendMessage(chatId, `User with id:${userId} was deleted`);
  }

  await bot.sendMessage(chatId, `User not exist or userId not valid: ${userId}`);
};
