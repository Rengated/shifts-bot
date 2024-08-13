import TelegramBot from "node-telegram-bot-api";
import { getDoc } from "../../../docs/index.js";
import { convertIdToName } from "../../utils/convertIdToName.js";

export const handleWeek = async (chatId: number, bot: TelegramBot) => {
  const document = getDoc();
  const username = await convertIdToName(chatId);

  //@ts-ignore
  const userShifts: { [key: string]: string } = document.find((shifts) => (shifts.USER as string).toLowerCase() == username.toLowerCase())!;

  if (!userShifts) {
    return await bot.sendMessage(chatId, "No shifts found for this user");
  }
  var responseMessage = "Shift for a week:";
  for (let day = 0; day < 7; day++) {
    let currentDate = String(new Date().getDate() + day);
    const todayShiftKey: string = Object.keys(userShifts!).find((key) => key.includes(currentDate))!;
    const status = userShifts[todayShiftKey];
    const date = new Date();
    date.setDate(date.getDate() + day);
    const formattedDate = date.toLocaleDateString("en-GB", { year: "numeric", day: "2-digit", month: "long" });
    if (status) {
      responseMessage += `\n\n📌Date: ${formattedDate}` + `\n🧑‍💻Name: ${username}` + `\n⚡Shift: ${status}`;
    }
  }
  await bot.sendMessage(chatId, responseMessage);
};
