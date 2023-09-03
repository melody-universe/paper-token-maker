import { toMatchImageSnapshot } from "jest-image-snapshot";
import { expect, test } from "vitest";
import makeToken from "../src/make-token";
import { readFile } from "fs/promises";
import { join } from "path";

expect.extend({ toMatchImageSnapshot });

test("generates a token spread", async () =>
  expect(
    await makeToken({
      buffer: await readFile(join(__dirname, "samples/default-1in-square.jpg")),
    })
  ).toMatchImageSnapshot({}));
