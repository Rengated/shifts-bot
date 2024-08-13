import TelegramBot from "node-telegram-bot-api";
import { saveFile } from "./bot/utils/saveFile.js";
import { handleToday } from "./bot/commands/user/handleToday.js";
import { handleTomorrow } from "./bot/commands/user/handleTomorrow.js";
import { handleWeek } from "./bot/commands/user/handleWeek.js";
import { getUsers } from "./bot/commands/administrator/getUsers.js";
import { addUser } from "./bot/commands/administrator/addUser.js";
import { deleteUser } from "./bot/commands/administrator/deleteUser.js";
import { convertIdToName } from "./bot/utils/convertIdToName.js";
import { description } from "./bot/commands/administrator/description.js";
import "dotenv/config";

const bot = new TelegramBot(process.env.BOT_KEY!, { polling: true });

const commands = [
  { command: "today", description: "Get a shift for today" },
  { command: "tomorrow", description: "Get a shift for tomorrow" },
  { command: "week", description: "Get a shift for a week" },
  { command: "start", description: "Start application" },
  { command: "description", description: "To get a list of admin commands" },
];

const admins: string[] = process.env.ADMINS_ID?.split(" ")!;

bot.setMyCommands(commands);
bot.on("document", async (msg) => {
  const chatId = msg.chat.id;

  const { document } = msg;

  if (document?.file_name?.includes(".xls")) {
    return await saveFile(document, bot, chatId);
  }

  if (document) {
    return await bot.sendMessage(chatId, "Only xls files are supported. Please send an xls file.");
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text) return;
  const username = await convertIdToName(chatId);
  if (!username && !admins.includes(String(chatId))) {
    return await bot.sendMessage(chatId, "Your are not allowed to use this bot, contact your administrator to get access");
  }

  switch (text.toLowerCase().split(" ")[0] || text.toLowerCase()) {
    case "/today":
      await handleToday(chatId, bot);
      break;

    case "/tomorrow":
      await handleTomorrow(chatId, bot);
      break;

    case "/week":
      await handleWeek(chatId, bot);
      break;

    case "/start":
      await bot.sendMessage(chatId, "Use /today, /tomorrow, /week to get your shift");
      break;

    case "/getusers":
      await getUsers(chatId, bot);
      break;

    case "/adduser":
      const message = msg.text;
      const newUser = message!.split(" ")[1]?.split(":");
      await addUser(chatId, bot, newUser);
      break;

    case "/description":
      await description(chatId, bot);
      break;

    case "/deleteuser":
      let deletingUser = msg?.text!.split(" ")[1];
      await deleteUser(chatId, Number(deletingUser), bot);
      break;
    default:
      await bot.sendMessage(chatId, "Unknown command. Please use /today, /tomorrow, /week, or /start.");
      break;
  }
});

process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
});
