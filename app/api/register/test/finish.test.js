import { expect } from "chai";
import app from "../../../index";
import { agent, errors, randomPhone, randomCPF } from "../../../../test/utils";

export default () => {
  describe("/finish", () => {
    const nbr = randomPhone();
    let code;
    let cpf;

    it("invalid password", async () => {
      await agent()
        .post("/register/phone")
        .field("ncode", "55")
        .field("nbr", nbr)
        .expect(200);

      const { code: cod } = await app.cache.get("verificationCode", nbr);
      cpf = randomCPF();
      code = cod;

      await agent()
        .post("/register/code")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .expect(200);

      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .field("cpf", cpf)
        .field("birth", "06/13/1994")
        .expect(200, { message: "ok" });

      await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .field("cpf", cpf)
        .field("name", "fernando")
        .field("birth", "06/13/1994")
        .expect(400, { ...errors[400], message: "invalid password" });

      await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .field("cpf", cpf)
        .field("name", "fernando")
        .field("pw", "1234")
        .field("birth", "06/13/1994")
        .expect(400, { ...errors[400], message: "invalid password" });
    });

    it("should be registered", async () => {
      const { body } = await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .field("username", "ferco0")
        .field("fn", "fernando")
        .field("ln", "costa")
        .field("pw", "1234567")
        .field("birth", "06/13/1994")
        .field("terms", "true")
        .expect(200);

      expect(body)
        .to.be.a("object")
        .that.have.all.keys(["id", "token"]);

      expect(body.id).to.be.a("string");
<<<<<<< HEAD
      expect(body.message).to.be.eq("ok");
=======
      expect(body.token).to.be.a("string");
>>>>>>> cf4d6750669803724b616896c4ac64bc1dacdec9

      const data = await app.models.users.getById(body.id);

      expect(data).to.be.a("object");
      expect(data.nbr).to.be.eq(nbr);
      expect(data.cpf).to.be.eq(cpf);
    });
  });
};
