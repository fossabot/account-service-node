import { expect } from "chai";
import app from "../../../index";
import { request } from "../../../../test/utils";
import { invalidCode, wrongCode } from "./errors";

export default () => {
  describe("/code", () => {
    it("error response if empty/no provided code", async () => {
      const { status, body } = await request("post", "/register/code", {
        json: {
          ncode: "55",
          phone: "82988704537"
        }
      });

      expect(status).to.be.eq(422);
      expect(body).to.be.deep.eq(invalidCode);
    });

    it("error response if provided a wrong code", async () => {
      const phone = "82988708888";

      const { status: st1 } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone
        }
      });

      expect(st1).to.be.eq(201);

      const { status: st2, body } = await request("post", "/register/code", {
        json: {
          ncode: "55",
          code: "00000",
          phone
        }
      });

      expect(st2).to.be.eq(422);
      expect(body).to.be.deep.eq(wrongCode);
    });

    it("success response if provided a right code", async () => {
      const phone = "82988707777";

      const { status: st1 } = await request("post", "/register/phone", {
        json: {
          ncode: "55",
          phone
        }
      });

      expect(st1).to.be.eq(201);

      const { code } = await app.verification.get(`reg:${phone}`);

      const { status: st2 } = await request("post", "/register/code", {
        json: {
          ncode: "55",
          phone,
          code
        }
      });

      expect(st2).to.be.eq(200);

      const { confirmed } = await app.verification.get(`reg:${phone}`);

      expect(confirmed).to.be.eq(true);
    });
  });
};
