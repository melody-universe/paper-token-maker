import Jimp from "jimp";

const paperWidth = 8.5;
const paperHeight = 11;

const margin = 0.25;
const contentWidth = paperWidth - margin * 2;
const contentHeight = paperHeight - margin * 2;

const ppi = 300;
const sheetWidth = contentWidth * ppi;
const sheetHeight = contentHeight * ppi;

export default function makeSheet(images: Jimp[]) {
  const sheet = new Jimp(sheetWidth, sheetHeight);
  let x = 0;
  let y = 0;
  for (const image of images) {
    if (x + image.getWidth() > sheetWidth) {
      y += image.getHeight();
      x = 0;
    }
    sheet.composite(image, x, y);
    x += image.getWidth();
  }
  return sheet;
}
