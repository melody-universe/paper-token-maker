import { toMatchImageSnapshot } from "jest-image-snapshot";
import { describe, expect, test } from "vitest";
import makeToken, { MakeTokenOptions } from "../src/make-token";
import { readFile } from "fs/promises";
import { join } from "path";

expect.extend({ toMatchImageSnapshot });

const loadSample = async (name: string) =>
  readFile(join(__dirname, `samples/${name}`));

const makeSample = async (name: string, options?: MakeTokenOptions) =>
  makeToken(await loadSample(name), options);

describe("default", () => {
  test("1-inch square", () =>
    expect(makeSample("1in-square.jpg")).resolves.toMatchImageSnapshot());

  test("1-inch tall", () =>
    expect(makeSample("1in-tall.jpg")).resolves.toMatchImageSnapshot());

  test("1.5-inch", () =>
    expect(makeSample("1.5in.jpg")).resolves.toMatchImageSnapshot());
});

describe("options", () => {
  test("base color", () =>
    expect(
      makeSample("1in-square.jpg", { base: { color: "#2c8265" } })
    ).resolves.toMatchImageSnapshot());

  test("base image", async () =>
    expect(
      makeSample("1in-square.jpg", {
        base: { buffer: await loadSample("1in-base.jpg") },
      })
    ).resolves.toMatchImageSnapshot());
});

describe("invalid input", () => {
  test("invalid size", () =>
    expect(makeSample("1x1.png")).rejects.toThrowError("invalid size"));
});
