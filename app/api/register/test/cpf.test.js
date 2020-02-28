import app from "../../../index";
import { request, result, randomPhone } from "../../../../test/utils";
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
    const validCPF = "87888501028";
    const registredCPF = "43325320074";
    const json = {
      ncode: "55",
      phone
    };

    it("error response if empty/wrong code", async () => {
      /**
       * unconfirmed
       */
      result(
        await request("post", "/register/phone", {
          json
        }),
        { "2xx": { code: 201 } }
      );

      result(
        await request("post", url, {
          json
        }),
        { "4xx": invalidCode }
      );

      result(
        await request("post", url, {
          json: { ...json, code: "00000" }
        }),
        { "4xx": wrongCode }
      );

      // confirm code
      json.code = (await app.verification.get(`reg:${phone}`)).code;
      await app.verification.check(`reg:${phone}`, json.code);
    });

    it("response that already registred cpf", async () => {
      result(
        await request("post", url, {
          json: {
            ...json,
            cpf: registredCPF,
            birth: "06/13/1994"
          }
        }),
        { "4xx": inUseCPF }
      );
    });

    it("error response if provide a invalid cpf", async () => {
      result(
        await request("post", url, {
          json: {
            ...json,
            cpf: "13546",
            birth: "06/13/1994"
          }
        }),
        { "4xx": invalidCPF }
      );
    });

    it("error response if invalid birth", async () => {
      result(
        await request("post", url, {
          json: {
            ...json,
            cpf: validCPF
          }
        }),
        { "4xx": invalidBirth }
      );

      result(
        await request("post", url, {
          json: {
            ...json,
            cpf: validCPF,
            birth: "46546"
          }
        }),
        { "4xx": invalidBirth }
      );
    });

    it("success response if provide a available cpf", async () => {
      result(
        await request("post", url, {
          json: {
            ...json,
            cpf: validCPF,
            birth: "06/13/1994"
          }
        }),
        { "2xx": { code: 200 } }
      );
    });
  });
};
