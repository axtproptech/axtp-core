import { describe, it, expect } from "vitest";
import { validatePixKey } from "../validatePixKey";
describe("validatePixKey", () => {
  it("should validate pix key", () => {
    expect(validatePixKey("oliver@mail.com")).toBeTruthy();
    expect(validatePixKey("+551998827366")).toBeTruthy();
    expect(validatePixKey("82267477084")).toBeTruthy();
    expect(validatePixKey("90173780000164")).toBeTruthy();
    expect(validatePixKey("123e4567-e89b-12d3-a456-426655440000")).toBeTruthy();
  });
  it("should validate pix key to false", () => {
    expect(validatePixKey("oliver")).toBeFalsy();
    expect(validatePixKey("234566")).toBeFalsy();
    expect(validatePixKey("https://something.com")).toBeFalsy();
    expect(validatePixKey("")).toBeFalsy();
  });
});
