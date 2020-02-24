import { expect } from "chai";
import faker from "faker";
import app from "../../../index";
import { agent, errors, randomPhone, randomCPF } from "../../../../test/utils";

export default () => {
  describe("/finish", () => {
    const nbr = randomPhone();
    let code;
    let cpf;

    it("invalid password", async () => {
      expect(
        (
          await agent()
            .post("/register/phone")
            .field("ncode", "55")
            .field("nbr", nbr)
        ).status
      ).to.be.eq(201);

      const { code: cod } = await app.cache.get(
        "verificationCode",
        `+55${nbr}`
      );
      cpf = randomCPF();
      code = cod;

      expect(
        (
          await agent()
            .post("/register/code")
            .field("ncode", "55")
            .field("nbr", nbr)
            .field("code", cod)
        ).status
      ).to.be.eq(200);

      expect(
        (
          await agent()
            .post("/register/cpf")
            .field("ncode", "55")
            .field("nbr", nbr)
            .field("code", cod)
            .field("cpf", cpf)
            .field("birth", "06/13/1994")
        ).body.message
      ).to.be.eq("ok");

      const req1 = await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .field("cpf", cpf)
        .field("fn", faker.name.firstName())
        .field("ln", faker.name.lastName())
        .field("username", faker.internet.userName())
        .field("birth", "06/13/1994")
        .expect(400, { ...errors[400], message: "invalid password" });

      expect(req1.status).to.be.eq(400);
      expect(req1.body.message).to.be.eq("invalid password");

      const req2 = await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", cod)
        .field("cpf", cpf)
        .field("fn", faker.name.firstName())
        .field("ln", faker.name.lastName())
        .field("username", faker.internet.userName())
        .field("pw", "1234")
        .field("birth", "06/13/1994")
        .expect(400, { ...errors[400], message: "invalid password" });

      expect(req2.status).to.be.eq(400);
      expect(req2.body.message).to.be.eq("invalid password");
    });

    it("should be registered", async () => {
      const { body } = await agent()
        .post("/register/finish")
        .field("ncode", "55")
        .field("nbr", nbr)
        .field("code", code)
        .field("cpf", cpf)
        .field("fn", faker.name.firstName())
        .field("ln", faker.name.lastName())
        .field("username", faker.internet.userName())
        .field("pw", "1234567")
        .field("birth", "06/13/1994")
        .field("terms", "true")
        .expect(201);

      expect(body)
        .to.be.a("object")
        .that.have.all.keys(["id", "message"]);

      expect(body.id).to.be.a("string");
      expect(body.message).to.be.eq("ok");

      const { data } = await app.models.users.getById(body.id);

      expect(data).to.be.a("object");
      expect(data.phones[0]).to.be.eq(nbr);
      expect(data.cpf).to.be.eq(cpf);
    });
  });
};
