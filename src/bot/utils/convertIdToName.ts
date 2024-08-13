import { readDatabase } from "../../database/database.js";

export const convertIdToName = async (chatId: number) => {
  const database = await readDatabase();
  return database[chatId];
};
