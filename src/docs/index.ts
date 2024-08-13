import xlsx from "node-xlsx";

export const getDoc = () => {
  const workSheetsFromFile = xlsx.parse("downloads/schedules.xlsx", { header: 0, defval: "Day Off", cellDates: true, cellText: true });
  return workSheetsFromFile[0].data;
};
