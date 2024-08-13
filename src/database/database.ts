import { writeFile, readFile } from "fs/promises";
import path from "path";

const dbFilePath = path.resolve("./database.json");

async function writeDatabase(data: JSON) {
  try {
    await writeFile(dbFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}
export async function readDatabase() {
  try {
    const data = await readFile(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    await writeFile(dbFilePath, JSON.stringify({}, null, 2));
    console.error("Error reading database:", error);
    return {};
  }
}

export async function createRecord(key: string, value: string | JSON) {
  const db = await readDatabase();
  db[key] = value;
  await writeDatabase(db);
  console.log(`Record created with key: ${key}`);
}

export async function deleteRecord(key: string) {
  const db = await readDatabase();
  if (!db[key]) {
    return false;
  }
  delete db[key];
  await writeDatabase(db);
  return true;
}
