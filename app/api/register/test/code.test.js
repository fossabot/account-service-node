import { expect } from "chai";
import app from "../../../index";
import { agent, errors } from "../../../../test/utils";

const invalidCode = { ...errors[400], message: "invalid code" };

export default () => {
  describe("/code", () => {
    it("error response if empty code", async () => {
      await agent()
        .post("/register/code")
        .field("nbr", "5582988704537")
        .expect(400, invalidCode);
    });

    it("error response if empty/no provided code", async () => {
      await agent()
        .post("/register/code")
        .field("nbr", "5582988704537")
        .expect(400, invalidCode);
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
        .expect(400, invalidCode);
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
