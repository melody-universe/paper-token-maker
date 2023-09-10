import { toMatchImageSnapshot } from "jest-image-snapshot";
import Jimp, { MIME_PNG } from "jimp";
import { expect, it } from "vitest";
import makeSheet from "./makeSheet";

expect.extend({ toMatchImageSnapshot });

it("creates a sheet", async ({ expect }) => {
  return await expect(
    makeSheet([
      new Jimp(1200, 450, "#f00"),
      new Jimp(1200, 450, "#0f0"),
      new Jimp(1200, 450, "#00f"),
    ]).getBufferAsync(MIME_PNG)
  ).resolves.toMatchImageSnapshot({
    customSnapshotIdentifier: "makeSheet",
  });
});
