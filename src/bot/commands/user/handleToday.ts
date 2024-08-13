import TelegramBot from "node-telegram-bot-api";
import { getDoc } from "../../../docs/index.js";
import { convertIdToName } from "../../utils/convertIdToName.js";

export const handleToday = async (chatId: number, bot: TelegramBot) => {
  const document = getDoc();

  const username = await convertIdToName(chatId);

  //@ts-ignore
  const userShifts: { [key: string]: string } = document.find((shifts) => (shifts.USER as string).toLowerCase() == username.toLowerCase())!;

  if (!userShifts) {
    return await bot.sendMessage(chatId, "No shifts found for this user");
  }

  const currentDate = String(new Date().getDate());
  const todayShiftKey: string = Object.keys(userShifts!).find((key) => key.includes(currentDate))!;
  const status = userShifts[todayShiftKey] || "dayoff";
  const formattedDate = new Date().toLocaleDateString("en-GB", { year: "numeric", day: "2-digit", month: "long" });
  const responseMessage = `Shift for today:\n📌Date: ${formattedDate}` + `\n🧑‍💻Name: ${username}` + `\n⚡️Shift: ${status}`;
  return await bot.sendMessage(chatId, responseMessage);
};
