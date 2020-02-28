import { request, result, randomPhone } from "../../../../test/utils";
import { invalidCountryCode, invalidPhone, phoneInUse } from "./errors";

export default () => {
  describe("/phone", () => {
    it("error response if invalid country code", async () => {
      result(
        await request("post", "/register/phone", {
          json: {
            ncode: ""
          }
        }),
        { "4xx": invalidCountryCode }
      );

      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "as"
          }
        }),
        { "4xx": invalidCountryCode }
      );
    });

    it("error response if invalid phone number", async () => {
      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone: "8248741"
          }
        }),
        { "4xx": invalidPhone }
      );
    });

    it("phone should be in use", async () => {
      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone: "82988704537"
          }
        }),
        { "4xx": phoneInUse }
      );
    });

    it("already requested code", async () => {
      const phone = randomPhone();

      const req = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone
        }
      });

      result(req, { code: 201 });

      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone
          }
        }),
        {
          code: 201,
          body: { created: req.created }
        }
      );
    });

    it("should create a verification code", async () => {
      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone: randomPhone()
          }
        }),
        {
          code: 201,
          body: { created: { type: "string" } }
        }
      );
    });
  });
};
