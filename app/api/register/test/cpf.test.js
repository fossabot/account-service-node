import app from "../../../index";
import { agent, errors, randomPhone } from "../../../../test/utils";

const url = "/register/cpf";

const invalidNumber = { ...errors[400], message: "invalid number" };
const invalidCode = { ...errors[400], message: "invalid code" };

export default () => {
  describe("/cpf", () => {
    it("error response if empty/invalid phone number", async () => {
      await agent()
        .post(url)
        .field("nbr", "")
        .expect(400, invalidNumber);

      await agent()
        .post(url)
        .field("code", "8248741")
        .expect(400, invalidNumber);
    });

    it("error response if empty code", async () => {
      const nbr = randomPhone();
      await agent()
        .post(url)
        .field("nbr", nbr)
        .expect(400, invalidCode);
    });

    it("error response if empty/no provided/unconfirmed code", async () => {
      const nbr = randomPhone();
      await agent()
        .post(url)
        .field("nbr", nbr)
        .expect(400, invalidCode);

      /**
       * unconfirmed
       */
      await agent()
        .post("/register/phone")
        .field("nbr", nbr)
        .expect(200);

      const { code } = await app.cache.get("verificationCode", nbr);

      await agent()
        .post("/register/cpf")
        .field("nbr", nbr)
        .field("code", code)
        .expect(400, invalidCode);
    });
  });
};
