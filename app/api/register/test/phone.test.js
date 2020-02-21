import { expect } from "chai";
import app from "../../../index";
import { agent, errors, randomPhone } from "../../../../test/utils";

export default () => {
  describe("/phone", () => {
    it("error response if invalid phone number", async () => {
      await agent()
        .post("/register/phone")
        .field("nbr", "")
        .expect(400, { ...errors[400], message: "invalid number" });

      await agent()
        .post("/register/phone")
        .field("nbr", "8248741")
        .expect(400, { ...errors[400], message: "invalid number" });

      await agent()
        .post("/register/phone")
        .field("ncode", "1231")
        .expect(400, { ...errors[400], message: "invalid number" });
    });

    it("phone should be in use", async () => {
      await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", "82988704537")
        .expect(200, { message: "in use" });
    });

    it("already requested code", async () => {
      const nbr = randomPhone();

      const {
        body: { created }
      } = await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", nbr)
        .expect(200);

      const { body } = await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", nbr)
        .expect(200);

      expect(body.created).to.be.eq(created);
    });

    it("should create a verification code", async () => {
      await app.cache.del("verificationCode", "21982163484");
      const { body } = await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", "21982163484")
        .expect(200);

      expect(body.message).to.be.eq("ok");
      expect(body.created).to.be.a("string");
    });
  });
};
