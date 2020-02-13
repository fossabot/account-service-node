import { expect } from "chai";
import { throwIfNotFoundSchema } from "./index";

describe("cache plugin", () => {
  it("throw if pass undefined schema", () => {
    expect(() => throwIfNotFoundSchema("session")).to.throw(
      'Not found schema for namespace "session"'
    );
  });
});
