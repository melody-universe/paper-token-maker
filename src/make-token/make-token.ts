import Jimp, { create, MIME_PNG } from "jimp";
import type MakeTokenConfig from "./MakeTokenConfig";
import cropCircle from "./crop-circle";

const makeToken: (config: MakeTokenConfig) => Promise<Buffer> = async ({
  buffer,
}: MakeTokenConfig) => {
  const input = await create(buffer);
  const width = input.getWidth();
  const height = input.getHeight();
  const radius = width / 2;
  const semiCircle = cropCircle(input, {
    x: radius,
    y: radius,
    radius,
  });
  const face =
    height > radius
      ? new Jimp(width, height)
          .composite(semiCircle, 0, 0)
          .composite(
            input.clone().crop(0, radius, width, height - radius),
            0,
            radius
          )
      : semiCircle;
  const centerLine = new Jimp(1, height, 0x00000030);
  const sideLine =
    height > radius ? new Jimp(1, height - radius, 0x00000030) : null;
  const base = new Jimp(width, radius)
    .composite(
      cropCircle(new Jimp(radius, radius, "black"), {
        x: radius,
        y: 0,
        radius,
      }),
      0,
      0
    )
    .composite(
      cropCircle(new Jimp(radius, radius, "black"), {
        x: 0,
        y: 0,
        radius,
      }),
      radius,
      0
    )
    .composite(
      cropCircle(new Jimp(radius, radius, "white"), {
        x: 0,
        y: 0,
        radius: radius - 1,
      }),
      radius,
      0
    )
    .composite(new Jimp(1, radius, "black"), radius, 0);
  let image = new Jimp(width * 4, height + radius);
  for (let i = 0; i < 4; i++) {
    image = image
      .composite(face, i * width, 0)
      .composite(base, i * width, height)
      .composite(centerLine, i * width + radius, 0);
    if (sideLine && i > 0) {
      image = image.composite(sideLine, i * width, radius);
    }
  }
  return await image.getBufferAsync(MIME_PNG);
};
export default makeToken;
