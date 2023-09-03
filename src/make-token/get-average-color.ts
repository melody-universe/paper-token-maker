import { BigFloat } from "bigfloat.js";
import Jimp from "jimp";

const getAverageColor: (image: Jimp) => number = (image) => {
  const totals = [new BigFloat(0), new BigFloat(0), new BigFloat(0)];
  let pixelCount = 0;
  for (let x = 1; x < image.getWidth(); x++) {
    for (let y = 1; y < image.getHeight(); y++) {
      const color = image.getPixelColor(x, y);
      if ((color & 0x000000ff) > 0) {
        for (let i = 0; i < 3; i++) {
          totals[i] = totals[i].add(
            parseInt(`0x${color.toString(16).substring(i * 2, i * 2 + 2)}`)
          );
        }
        pixelCount++;
      }
    }
  }
  return parseInt(
    "0x" +
      totals.reduce(
        (color, value) =>
          color +
          Math.round(
            parseFloat(value.dividedBy(pixelCount).toString())
          ).toString(16),
        ""
      ) +
      "ff"
  );
};

export default getAverageColor;

// const getAverageColor: (image: Jimp) => number = (image) => {
//   const averages = [0, 0, 0];
//   let pixelCount = 0;
//   for (let x = 1; x < image.getWidth(); x++) {
//     for (let y = 1; y < image.getHeight(); y++) {
//       const color = image.getPixelColor(x, y);
//       if ((color & 0x000000ff) > 0) {
//         for (let i = 0; i < 3; i++) {
//           averages[i] +=
//             (((color >> (2 + 2 * i)) & 0xff) - averages[i]) / (pixelCount + 1);
//         }
//         pixelCount++;
//       }
//     }
//   }
//   console.log(averages);
//   return (
//     (averages.reduce(
//       (total, average, i) => total + (Math.round(average) << (2 * i))
//     ) <<
//       2) |
//     0xff
//   );
// };
