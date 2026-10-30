/* global Office, Excel */

import "./styles.css";
import { fetchEarthquakes } from "./api.js";                 // Person 2
import { formatEarthquakeData } from "./formatter.js";       // Person 3
import { showLoader, hideLoader, setStatus, setButtonsDisabled } from "./ui.js"; // Person 4

const SHEET_NAME = "Earthquakes";

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("fetch-btn").onclick = handleFetchClick;
    document.getElementById("clear-btn").onclick = handleClearClick;
  }
});

async function handleFetchClick() {
  showLoader();
  setButtonsDisabled(true);
  setStatus("", false);

  try {
    const rawData = await fetchEarthquakes();          // 1. fetch
    const table = formatEarthquakeData(rawData);       // 2. transform to 2D array
    await writeToWorksheet(table);                     // 3. write to Excel

    const count = table.length - 1;                    // minus header row
    setStatus(
      count === 0
        ? "No earthquakes reported in the past hour."
        : `Loaded ${count} earthquake${count === 1 ? "" : "s"}.`,
      false
    );
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Something went wrong.", true);
  } finally {
    hideLoader();
    setButtonsDisabled(false);
  }
}

async function writeToWorksheet(table) {
  await Excel.run(async (context) => {
    // Use a dedicated sheet so we never overwrite the user's own data
    let sheet = context.workbook.worksheets.getItemOrNullObject(SHEET_NAME);
    await context.sync();

    if (sheet.isNullObject) {
      sheet = context.workbook.worksheets.add(SHEET_NAME);
    }

    sheet.getRange().clear();

    const rowCount = table.length;
    const colCount = table[0].length;
    const range = sheet.getRangeByIndexes(0, 0, rowCount, colCount);
    range.values = table;

    // Style the header row (orange to match the UI theme)
    const header = sheet.getRangeByIndexes(0, 0, 1, colCount);
    header.format.fill.color = "#FF7A00";
    header.format.font.color = "#FFFFFF";
    header.format.font.bold = true;

    range.format.autofitColumns();
    sheet.activate();
    await context.sync();
  });
}

async function handleClearClick() {
  try {
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getItemOrNullObject(SHEET_NAME);
      await context.sync();
      if (!sheet.isNullObject) {
        sheet.getRange().clear();
        await context.sync();
      }
    });
    setStatus("Sheet cleared.", false);
  } catch (error) {
    setStatus(error.message || "Could not clear the sheet.", true);
  }
}
