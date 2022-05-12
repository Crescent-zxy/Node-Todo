const db = require("../db.js");
const fs = require("fs");
jest.mock("fs");

describe("db", () => {
  afterEach(() => {
    fs.clearMocks();
  });
  it("can read", async () => {
    const data = [{ title: "hi", done: true }];
    fs.setMock("/xxx", null, JSON.stringify(data));
    const list = await db.read("/xxx");
    expect(list).toStrictEqual(data);
  });
  it("can write", async () => {
    let fakeFile;
    fs.setMock("/yyy", null, (path, data, callback) => {
      fakeFile = data;
      callback(null);
    });
    const list = [{ title: "xxx", done: false }];
    await db.write(list, "/yyy");
    expect(fakeFile).toBe(JSON.stringify(list) + "\n");
  });
});
