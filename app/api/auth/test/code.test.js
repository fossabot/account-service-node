import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent, errors } from "../../../../test/utils";
import app from "../../../index";

export default () => {
  describe("/code", () => {
    it("incomplete fields", async () => {
      await agent()
        .post("/auth/code")
        .field("id", "82999999999")
        .expect(400, {
          ...errors[400]
        });

      await agent()
        .post("/auth/code")
        .field("code", "00")
        .expect(400, {
          ...errors[400]
        });
    });

    it("invalid code", async () => {
      await agent()
        .post("/auth/code")
        .field("id", "82999999999")
        .field("code", "123")
        .expect(400);
    });

    it("inexistent code", async () => {
      await agent()
        .post("/auth/code")
        .field("id", "82999999999")
        .field("code", "12345")
        .expect(406);
    });

    it("wrong code", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82988873646")
        .field("pw", "123456")
        .expect(200, { next: "code", target: "** *****-3646" });

      await agent()
        .post("/auth/code")
        .field("id", "82988873646")
        .field("code", "12345")
        .expect(406);
    });

    it("right code", async () => {
      const { code } = await app.cache.get("verificationCode", "82988873646");

      expect(code).to.be.a("string");

      const { body } = await agent()
        .post("/auth/code")
        .field("id", "82988873646")
        .field("code", code)
        .expect(200);

      const decoded = await decode(body.token);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });
  });
};
