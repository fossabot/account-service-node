import { expect } from "chai";
import app from "../../../index";
import { agent, errors, randomPhone, randomCPF } from "../../../../test/utils";

export default () => {
  describe("/record", () => {
    const nbr = randomPhone();
    let code;

    it("invalid password", async () => {
      await agent()
        .post("/register/phone")
        .field("nbr", nbr)
        .expect(200);

      const { code: cod } = await app.cache.get("verificationCode", nbr);
      const cpf = randomCPF();
      code = cod;

      await agent()
        .post("/register/code")
        .field("nbr", nbr)
        .field("code", code)
        .expect(200, { message: "ok" });

      await agent()
        .post("/register/cpf")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .expect(200, { message: "available" });

      await agent()
        .post("/register/record")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .field("name", "fernando")
        .field("birth", new Date("06/13/1994").toString())
        .expect(400, { ...errors[400], message: "invalid password" });

      await agent()
        .post("/register/record")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .field("name", "fernando")
        .field("pw", "1234")
        .field("birth", new Date("06/13/1994").toString())
        .expect(400, { ...errors[400], message: "invalid password" });
    });

    it("should be registered", async () => {
      const cpf = randomCPF();

      const { body } = await agent()
        .post("/register/record")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .field("name", "fernando")
        .field("pw", "1234567")
        .field("birth", new Date("06/13/1994").toString())
        .expect(200);

      expect(body.id).to.be.a("string");

      const data = await app.models.users.getById(body.id);

      expect(data).to.be.a("object");
      expect(data.nbr).to.be.eq(nbr);
      expect(data.cpf).to.be.eq(cpf);
    });
  });
};
