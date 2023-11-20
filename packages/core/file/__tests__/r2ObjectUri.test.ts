import { R2ObjectUri } from "../r2ObjectUri";

describe("r2ObjectUri", () => {
  it("can creates a R2 object uri", () => {
    const uri = new R2ObjectUri({
      accountId: "accountId",
      bucket: "bucket",
      objectId: "objectId",
    });
    expect(uri.toString()).toBe("r2://accountId/bucket?id=objectId");
  });
  it("can parse R2 object uri", () => {
    const uri = R2ObjectUri.fromUrl("r2://accountId/bucket?id=objectId");
    expect(uri.parts).toEqual({
      accountId: "accountId",
      bucket: "bucket",
      objectId: "objectId",
    });
  });
  it("should trow on invalid URI", () => {
    expect(() => {
      R2ObjectUri.fromUrl("r2://accountId/bucket?fail=fail");
    }).toThrow("Invalid R2 Object URI");
    expect(() => {
      R2ObjectUri.fromUrl("http://accountId/bucket?id=fail");
    }).toThrow("Invalid R2 Object URI");
    expect(() => {
      R2ObjectUri.fromUrl("r2://accountId?id=fail");
    }).toThrow("Invalid R2 Object URI");
  });
});
