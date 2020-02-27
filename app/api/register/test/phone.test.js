import { expect } from "chai";
import { request, randomPhone } from "../../../../test/utils";
import { invalidCountryCode, invalidPhone, phoneInUse } from "./errors";

export default () => {
  describe("/phone", () => {
    it("error response if invalid country code", async () => {
      const { status, body } = await request("post", "/register/phone", {
        json: {
          ncode: ""
        }
      });

      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(invalidCountryCode);

      const { status: st2, body: bd2 } = await request(
        "post",
        "/register/phone",
        {
          json: {
            ncode: "as"
          }
        }
      );

      expect(st2).to.be.eq(422);
      expect(bd2).to.be.deep.eq(invalidCountryCode);
    });

    it("error response if invalid phone number", async () => {
      const { status, body } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone: "8248741"
        }
      });
      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(invalidPhone);
    });

    it("phone should be in use", async () => {
      const { status, body } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone: "82988704537"
        }
      });
      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(phoneInUse);
    });

    it("already requested code", async () => {
      const phone = randomPhone();

      const {
        status: st1,
        body: { created }
      } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone
        }
      });
      expect(st1).to.be.eq(201);

      const { status: st2, body } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone
        }
      });

      expect(st2).to.be.eq(201);
      expect(body.created).to.be.eq(created);
    });

    it("should create a verification code", async () => {
      const { body } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone: randomPhone()
        }
      });

      expect(body.created).to.be.a("string");
    });
  });
};
