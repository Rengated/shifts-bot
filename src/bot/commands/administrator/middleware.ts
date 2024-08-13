import TelegramBot from "node-telegram-bot-api";

export const middleware = async (chatId: number, bot: TelegramBot) => {
  const admins = process.env.ADMINS_ID?.split(" ");
  if (!admins?.includes(String(chatId))) {
    await bot.sendMessage(chatId, "Yor are now authorized as admin, to use this command. To see avaliable list of commands, use /start");
    return false;
  }
  return true;
};
