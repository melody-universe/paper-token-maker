import { toMatchImageSnapshot } from "jest-image-snapshot";
import { describe, expect, test } from "vitest";
import makeToken, { MakeTokenOptions } from "../src/make-token";
import { readFile } from "fs/promises";
import { join } from "path";

expect.extend({ toMatchImageSnapshot });

describe.concurrent("default", () => {
  runSnapshotTest("1-inch square", "1in-square.jpg");
  runSnapshotTest("1-inch tall", "1in-tall.jpg");
  runSnapshotTest("1.5-inch", "1.5in.jpg");
});

describe.concurrent("options", () => {
  runSnapshotTest("base color", "1in-square.jpg", {
    base: { color: "#2c8265" },
  });
  runSnapshotTest("base image", "1in-square.jpg", async () => ({
    base: { buffer: await loadImage("1in-base.jpg") },
  }));
});

describe("invalid input", () => {
  test("invalid size", async () =>
    expect(makeToken(await loadImage("1x1.png"))).rejects.toThrowError(
      "invalid size"
    ));
});

function runSnapshotTest(
  name: string,
  imageName: string,
  optionsFactory: () => Promise<MakeTokenOptions>
): void;
function runSnapshotTest(
  name: string,
  imageName: string,
  options?: MakeTokenOptions
): void;
function runSnapshotTest(
  name: string,
  imageName: string,
  options?: MakeTokenOptions | (() => Promise<MakeTokenOptions>)
) {
  test(name, async ({ expect }) =>
    expect(
      typeof options === "function"
        ? makeToken(...(await Promise.all([loadImage(imageName), options()])))
        : makeToken(await loadImage(imageName), options)
    ).resolves.toMatchImageSnapshot({
      customSnapshotIdentifier: name.replace(/[. ]/, "-"),
    })
  );
}

const imagePromises = new Map<string, Promise<Buffer>>();
function loadImage(name: string) {
  if (!imagePromises.has(name)) {
    imagePromises.set(name, readFile(join(__dirname, "samples", name)));
  }
  return imagePromises.get(name)!;
}
