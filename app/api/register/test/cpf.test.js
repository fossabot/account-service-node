import { expect } from "chai";
import app from "../../../index";
import { request, agent, randomPhone } from "../../../../test/utils";
import {
  wrongCode,
  invalidCode,
  inUseCPF,
  invalidCPF,
  invalidBirth
} from "./errors";

const url = "/register/cpf";

export default () => {
  describe("/cpf", () => {
    const phone = randomPhone();
    const json = {
      ncode: "55",
      phone
    };
    let code;

    it("error response if empty/wrong code", async () => {
      /**
       * unconfirmed
       */
      const { status: st1 } = await request("post", "/register/phone", {
        json
      });

      expect(st1).to.be.eq(201);

      const { status: st2, body: body2 } = await request("post", url, {
        json
      });

      expect(st2).to.be.eq(422);
      expect(body2).to.be.deep.eq(invalidCode);

      const { status: st3, body: body3 } = await request("post", url, {
        json: { ...json, code: "00000" }
      });

      expect(st3).to.be.eq(422);
      expect(body3).to.be.deep.eq(wrongCode);

      const { code: cod } = await app.verification.get(`reg:${phone}`);
      json.code = cod;
    });

    it("response that already registred cpf", async () => {
      // confirm code of previous test
      expect(
        (
          await request("post", "/register/code", {
            json: {
              ...json,
              code: (await app.verification.get(`reg:${phone}`)).code
            }
          })
        ).status
      ).to.be.eq(200);

      const { status, body } = await request("post", url, {
        json: {
          ...json,
          cpf: "76759553072",
          birth: "06/13/1994"
        }
      });

      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(inUseCPF);
    });

    it("error response if provide a invalid cpf", async () => {
      const { status, body } = await request("post", "/register/code", {
        json: {
          ...json,
          cpf: "13546",
          birth: "06/13/1994"
        }
      });

      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(invalidCPF);
    });

    it("error response if not provided birth", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", phone)
        .field("code", code)
        .field("cpf", "87888501028")
        .expect(400, invalidBirth);
    });

    it("error response if invalid birth", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", phone)
        .field("code", code)
        .field("cpf", "87888501028")
        .field("birth", ".4579")
        .expect(400, invalidBirth);
    });

    it("success response if provide a available cpf", async () => {
      await agent()
        .post("/register/cpf")
        .field("ncode", "55")
        .field("nbr", phone)
        .field("code", code)
        .field("cpf", "87888501028")
        .field("birth", "06/13/1994")
        .expect(200, { message: "ok" });
    });
  });
};
