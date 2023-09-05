import Jimp, { create, MIME_PNG } from "jimp";
import cropCircle from "./crop-circle";

const validSizes = new Set([240, 300, 450, 600]);

const foldColor = 0x00000030;
const lightFoldColor = 0xffffff30;

const createBaseFactory = async (
  width: number,
  radius: number,
  options?: BaseOptions
) => {
  const fold = cropCircle(new Jimp(radius, radius, "black"), {
    x: 0,
    y: 0,
    radius,
  })
    .composite(
      cropCircle(new Jimp(radius, radius, "white"), {
        x: 0,
        y: 0,
        radius: radius - 1,
      }),
      0,
      0
    )
    .composite(new Jimp(1, radius, "black"), 0, 0)
    .composite(new Jimp(radius, 1, foldColor), 0, 0);

  if (options?.buffer) {
    const image = (await create(options.buffer)).circle();
    return (index: number) =>
      new Jimp(width, radius)
        .composite(
          image
            .clone()
            .rotate(-1 * index * 90)
            .crop(0, radius, radius, radius),
          0,
          0
        )
        .composite(new Jimp(radius, 1, foldColor), 0, 0)
        .composite(fold, radius, 0);
  } else {
    const base = new Jimp(width, radius)
      .composite(
        cropCircle(new Jimp(radius, radius, options?.color ?? "black"), {
          x: radius,
          y: 0,
          radius,
        }),
        0,
        0
      )
      .composite(
        new Jimp(radius, 1, options?.color ? foldColor : lightFoldColor),
        0,
        0
      )
      .composite(fold, radius, 0);
    return (_: number) => base;
  }
};

const makeToken: (
  buffer: Buffer,
  options?: MakeTokenOptions
) => Promise<Buffer> = async (buffer, options) => {
  const input = await create(buffer);
  const width = input.getWidth();

  if (!validSizes.has(width)) {
    throw new Error("invalid size");
  }

  const height = input.getHeight();
  const radius = width / 2;
  const semiCircle = cropCircle(input, {
    x: radius,
    y: radius,
    radius,
  });
  const topBorder = new Jimp(width, height, foldColor).mask(
    cropCircle(new Jimp(width, radius, "white"), {
      x: radius,
      y: radius,
      radius,
    }).composite(
      cropCircle(new Jimp(width, radius, "black"), {
        x: radius,
        y: radius,
        radius: radius - 1,
      }),
      0,
      0
    ),
    0,
    0
  );

  const face =
    height > radius
      ? new Jimp(width, height)
          .composite(semiCircle, 0, 0)
          .composite(topBorder, 0, 0)
          .composite(
            input.clone().crop(0, radius, width, height - radius),
            0,
            radius
          )
      : semiCircle;
  const centerLine = new Jimp(1, height, foldColor);
  const sideLine =
    height > radius ? new Jimp(1, height - radius, foldColor) : null;
  const getBase = await createBaseFactory(width, radius, options?.base);

  let image = new Jimp(width * 4, height + radius);
  for (let i = 0; i < 4; i++) {
    image = image
      .composite(face, i * width, 0)
      .composite(getBase(i), i * width, height)
      .composite(centerLine, i * width + radius, 0);
    if (sideLine && i > 0) {
      image = image.composite(sideLine, i * width, radius);
    }
  }
  if (height > radius) {
    const sideLine = new Jimp(1, height - radius, foldColor);
    image = image
      .composite(sideLine, 0, radius)
      .composite(sideLine, width * 4 - 1, radius);
  }
  return await image.getBufferAsync(MIME_PNG);
};
export default makeToken;

type BaseOptions = { color?: string; buffer?: Buffer };
export type MakeTokenOptions = { base?: BaseOptions };
