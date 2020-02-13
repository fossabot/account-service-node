import app from "../../../index";
import { agent, errors, randomPhone } from "../../../../test/utils";

const url = "/register/cpf";

// const invalidNumber = { ...errors[400], message: "invalid number" };
const invalidCode = { ...errors[400], message: "invalid code" };
const invalidCPF = { ...errors[400], message: "invalid cpf" };
const invalidBirth = { ...errors[400], message: "invalid birth" };

export default () => {
  describe("/cpf", () => {
    const nbr = randomPhone();
    let code;

    it("error response if empty/no provided/unconfirmed code", async () => {
      await agent()
        .post(url)
        .field("ncode", "55")
        .field("nbr", nbr)
        .expect(400, invalidCode);

      /**
       * unconfirmed
       */
      await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", nbr)
        .expect(200);

      const { code: cod } = await app.cache.get("verificationCode", nbr);
      code = cod;
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .expect(400, invalidCode);
    });

    it("response warn that already registred cpf", async () => {
      // confirm code of previous test
      await agent()
        .post("/register/code")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .expect(200);

      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", "07226841002")
        .field("birth", "06/13/1994")
        .expect(200, { message: "in use" });
    });

    it("error response if provide a invalid cpf", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", "16546")
        .expect(400, invalidCPF);
    });

    it("error response if not provided birth", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", "87888501028")
        .expect(400, invalidBirth);
    });

    it("error response if invalid birth", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", "87888501028")
        .field("birth", ".4579")
        .expect(400, invalidBirth);
    });

    it("success response if provide a available cpf", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", "87888501028")
        .field("birth", "06/13/1994")
        .expect(200, { message: "ok" });
    });
  });
};
