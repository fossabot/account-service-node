import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent, getToken, errors } from "../../../../test/utils";

export default () => {
  describe("/credential", () => {
    it("incomplete fields", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82999999999")
        .expect(400, {
          ...errors[400]
        });
    });
    it("not found", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82999999999")
        .field("pw", "123")
        .expect(200, { user: null });
    });

    it("wrong credentials", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82988704537")
        .field("pw", "1234")
        .expect(401, { ...errors[401], message: "wrong credentials" });
    });

    it("gen token", async () => {
      const token = await getToken();

      expect(token).to.be.a("string");

      const decoded = await decode(token);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat", "lvl"]);
    });
  });
};
