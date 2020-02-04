import { expect } from "chai";
import app from "../../../index";
import { agent, errors } from "../../../../test/utils";

export default () => {
  describe("/code", () => {
    it("error response if empty/invalid phone number", async () => {
      await agent()
        .post("/register/code")
        .field("nbr", "")
        .expect(400, { ...errors[400], message: "invalid number" });

      await agent()
        .post("/register/code")
        .field("code", "8248741")
        .expect(400, { ...errors[400], message: "invalid number" });
    });

    it("error response if empty code", async () => {
      await agent()
        .post("/register/code")
        .field("nbr", "5582988704537")
        .expect(400, { ...errors[400], message: "invalid code" });
    });

    it("error response if empty/no provided code", async () => {
      await agent()
        .post("/register/code")
        .field("nbr", "5582988704537")
        .expect(400, { ...errors[400], message: "invalid code" });
    });

    it("error response if provided a wrong code", async () => {
      const nbr = "5582988708888";

      await agent()
        .post("/register/phone")
        .field("nbr", nbr)
        .expect(200);

      await agent()
        .post("/register/code")
        .field("nbr", nbr)
        .field("code", "00000")
        .expect(200, { message: "wrong code" });
    });

    it("success response if provided a right code", async () => {
      const nbr = "5582988707777";

      await agent()
        .post("/register/phone")
        .field("nbr", nbr)
        .expect(200);

      const { code } = await app.cache.get("verificationCode", nbr);

      await agent()
        .post("/register/code")
        .field("nbr", nbr)
        .field("code", code)
        .expect(200, { message: "ok" });

      const { confirmed } = await app.cache.get("verificationCode", nbr);

      expect(confirmed).to.be.eq(true);
    });
  });
};
