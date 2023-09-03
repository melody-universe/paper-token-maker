import Jimp, { create, MIME_PNG } from "jimp";
import type MakeTokenConfig from "./MakeTokenConfig";
import cropCircle from "./crop-circle";
import getAverageColor from "./get-average-color";

const makeToken: (config: MakeTokenConfig) => Promise<Buffer> = async ({
  buffer,
}: MakeTokenConfig) => {
  const input = await create(buffer);
  const width = input.getWidth();
  const height = input.getHeight();
  const semiCircle = cropCircle(input, {
    x: 150,
    y: 150,
    radius: 150,
  });
  const face =
    height > 150
      ? new Jimp(width, height)
          .composite(semiCircle, 0, 0)
          .composite(input.clone().crop(0, 150, 300, height - 150), 0, 150)
      : semiCircle;
  const centerLine = new Jimp(1, height, 0x00000030);
  const sideLine = height > 150 ? new Jimp(1, height - 150, 0x00000030) : null;
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
  let image = new Jimp(1200, height + 150);
  for (let i = 0; i < 4; i++) {
    image = image
      .composite(face, i * 300, 0)
      .composite(base, i * 300, height)
      .composite(centerLine, i * 300 + 150, 0);
    if (sideLine && i > 0) {
      image = image.composite(sideLine, i * 300, 150);
    }
  }
  return await image.getBufferAsync(MIME_PNG);
};
export default makeToken;
