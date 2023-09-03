import Jimp from "jimp";

const getAverageColor: (image: Jimp) => number = (image) => {
  let average = 0;
  let pixelCount = 0;
  for (let x = 1; x < image.getWidth(); x++) {
    for (let y = 1; y < image.getHeight(); y++) {
      const color = image.getPixelColor(x, y);
      if ((color & 0x000000ff) > 0) {
        average = average + ((color >> 2) - average) / (pixelCount + 1);
        pixelCount++;
      }
    }
  }
  return (average << 2) | 0xff;
};

export default getAverageColor;
