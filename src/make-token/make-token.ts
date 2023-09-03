import Jimp, { create, MIME_PNG } from "jimp";
import type MakeTokenConfig from "./MakeTokenConfig";
import cropCircle from "./crop-circle";
import getAverageColor from "./get-average-color";

const makeToken: (config: MakeTokenConfig) => Promise<Buffer> = async ({
  buffer,
}: MakeTokenConfig) => {
  const face = cropCircle(await create(buffer), {
    x: 150,
    y: 150,
    radius: 150,
  });
  const base = new Jimp(300, 150)
    .composite(
      cropCircle(new Jimp(150, 150, getAverageColor(face)), {
        x: 150,
        y: 0,
        radius: 150,
      }),
      0,
      0
    )
    .composite(
      cropCircle(new Jimp(150, 150, "black"), {
        x: 0,
        y: 0,
        radius: 150,
      }),
      150,
      0
    )
    .composite(
      cropCircle(new Jimp(150, 150, "white"), {
        x: 0,
        y: 0,
        radius: 149,
      }),
      150,
      0
    )
    .composite(new Jimp(1, 150, "black"), 150, 0);
  let image = new Jimp(1200, 300);
  for (let i = 0; i < 4; i++) {
    image = image.composite(face, i * 300, 0).composite(base, i * 300, 150);
  }
  return await image.getBufferAsync(MIME_PNG);
};
export default makeToken;
