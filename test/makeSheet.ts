import Jimp from "jimp";

const paperWidth = 8.5;
const paperHeight = 11;

const margin = 0.25;
const contentWidth = paperWidth - margin * 2;
const contentHeight = paperHeight - margin * 2;

const ppi = 300;
const sheetWidth = contentWidth * ppi;
const sheetHeight = contentHeight * ppi;

export default function makeSheet(image: Jimp) {
  const sheet = new Jimp(sheetWidth, sheetHeight);
  sheet.composite(image, 0, 0);
  return sheet;
}
