import { toMatchImageSnapshot } from "jest-image-snapshot";
import { expect, test } from "vitest";
import makeToken from "../src/make-token";
import { readFile } from "fs/promises";
import { join } from "path";

expect.extend({ toMatchImageSnapshot });

const testSample = (sampleName: string) =>
  test(`generates a token spread (${sampleName})`, async () =>
    expect(
      await makeToken({
        buffer: await readFile(join(__dirname, `samples/${sampleName}`)),
      })
    ).toMatchImageSnapshot());

["default-1in-square.jpg", "default-1in-tall.jpg"].forEach(testSample);
