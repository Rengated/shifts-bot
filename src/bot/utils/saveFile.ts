import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs";
import TelegramBot from "node-telegram-bot-api";
import { promisify } from "util";
import { pipeline } from "stream";

export const saveFile = async (document: TelegramBot.Document, bot: TelegramBot, chatId: number) => {
  const streamPipeline = promisify(pipeline);
  const downloadsDir = "./downloads";
  if (!existsSync(downloadsDir)) {
    mkdirSync(downloadsDir);
  }

  try {
    const response = await bot.getFile(document.file_id);
    const downloadLink = `https://api.telegram.org/file/bot${process.env.BOT_KEY}/${response.file_path}`;
    const downloadResponse = await fetch(downloadLink);

    if (!downloadResponse.ok) {
      throw new Error(`Failed to download file: ${downloadResponse.statusText}`);
    }

    const filePath = `${downloadsDir}/schedules.xlsx`;
    const fileStream = createWriteStream(filePath);
    await streamPipeline(downloadResponse.body!, fileStream);
    console.log(`File saved to ${filePath}`);
    await bot.sendMessage(chatId, `You file downloaded`);
  } catch (error) {
    await bot.sendMessage(chatId, "There was an error processing your file.");
  }
};
