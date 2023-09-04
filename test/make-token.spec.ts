import { toMatchImageSnapshot } from "jest-image-snapshot";
import { describe, expect, test } from "vitest";
import makeToken from "../src/make-token";
import { readFile } from "fs/promises";
import { join } from "path";

expect.extend({ toMatchImageSnapshot });

const loadSample = async (name: string) =>
  readFile(join(__dirname, `samples/${name}`));

describe("default", () => {
  test("1-inch square", async () =>
    expect(
      await makeToken({
        buffer: await loadSample("default-1in-square.jpg"),
      })
    ).toMatchImageSnapshot());

  test("1-inch tall", async () =>
    expect(
      await makeToken({
        buffer: await loadSample("default-1in-tall.jpg"),
      })
    ).toMatchImageSnapshot());

  test("1.5-inch", async () =>
    expect(
      await makeToken({
        buffer: await loadSample("default-1.5in.jpg"),
      })
    ).toMatchImageSnapshot());
});
