import Jimp from "jimp";

const cropCircle: (image: Jimp, options: CircleCropOptions) => Jimp = (
  image,
  options
) =>
  image
    .clone()
    .mask(
      new Jimp(image.getWidth(), image.getHeight(), "black").composite(
        new Jimp(image.getWidth(), image.getHeight(), "white")
          .circle(options)
          .crop(0, 0, image.getWidth(), image.getHeight()),
        0,
        0
      ),
      0,
      0
    );
export default cropCircle;

type CircleCropOptions = { x: number; y: number; radius: number };
