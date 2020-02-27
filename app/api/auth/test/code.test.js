import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent } from "../../../../test/utils";
import app from "../../../index";
import { invalidCode, wrongCode } from "./errors";

export default () => {
  describe("/code", () => {
    it("invalid code", async () => {
      await agent()
        .post("/auth/code")
        .field("id", "82999999999")
        .expect(422, invalidCode);

      await agent()
        .post("/auth/code")
        .field("code", "00")
        .field("id", "82999999999")
        .expect(422, invalidCode);
    });

    it("inexistent code", async () => {
      await agent()
        .post("/auth/code")
        .field("id", "82999999999")
        .field("code", "12345")
        .expect(422, wrongCode);
    });

    it("wrong code", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82988873646")
        .field("pw", "123456")
        .expect(200, { content: "** *****-3646" });

      await agent()
        .post("/auth/code")
        .field("id", "82988873646")
        .field("code", "12345")
        .expect(422, wrongCode);
    });

    it("right code", async () => {
      const { code } = await app.cache.get("verificationCode", "82988873646");

      expect(code).to.be.a("string");

      const { body } = await agent()
        .post("/auth/code")
        .field("id", "82988873646")
        .field("code", code)
        .expect(201);

      const decoded = await decode(body.content);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });
  });
};
