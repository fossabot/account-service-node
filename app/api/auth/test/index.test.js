import identify from "./identify.test";
import credential from "./credential.test";
import code from "./code.test";
import unsign from "./unsign.test";

describe("authorization", () => {
  identify();
  credential();
  code();
  unsign();
});
