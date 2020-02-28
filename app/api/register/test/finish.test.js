import { expect } from "chai";
import faker from "faker";
import app from "../../../index";
import { generateCPF } from "@brazilian-utils/brazilian-utils";
import { request, result, randomPhone } from "../../../../test/utils";

export default () => {
  describe("/finish", () => {
    const phone = randomPhone();
    const json = {
      ncode: "55",
      phone
    };

    it("should be registered", async () => {
      json.cpf = generateCPF();
      json.birth = "06/13/1994";
      json.code = (await app.verification.create(`reg:${json.phone}`)).code;

      await app.verification.update(`reg:${json.phone}`, { cpf: json.cpf });

      json.fn = faker.name.firstName();
      json.ln = faker.name.lastName();
      json.username = faker.internet.userName();
      json.pw = "123456";
      json.terms = true;

      result(
        await request("post", "/register/finish", {
          json
        }),
        { "2xx": { code: 201 } }
      );

      const data = await app.models.users.get(json.username);

      expect(data).to.be.a("object");
      expect(data.phones[0]).to.be.eq(json.phone);
      expect(data.cpf).to.be.eq(json.cpf);
    });
  });
};
