import { expect } from "chai";
import app from "../../../index";
import { request, result } from "../../../../test/utils";
import { invalidCode, wrongCode } from "./errors";

export default () => {
  describe("/code", () => {
    it("error response if empty/no provided code", async () => {
      result(
        await request("post", "/register/code", {
          json: {
            ncode: "55",
            phone: "82988704537"
          }
        }),
        {
          "4xx": invalidCode
        }
      );
    });

    it("error response if provided a wrong code", async () => {
      const phone = "82988708888";

      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone
          }
        }),
        { "2xx": { code: 201 } }
      );

      result(
        await request("post", "/register/code", {
          json: {
            ncode: "55",
            code: "00000",
            phone
          }
        }),
        { "4xx": wrongCode }
      );
    });

    it("success response if provided a right code", async () => {
      const phone = "82988707777";

      result(
        await request("post", "/register/phone", {
          json: {
            ncode: "55",
            phone
          }
        }),
        { "2xx": { code: 201 } }
      );

      const { code } = await app.verification.get(`reg:${phone}`);

      result(
        await request("post", "/register/code", {
          json: {
            ncode: "55",
            phone,
            code
          }
        }),
        { "2xx": { code: 200 } }
      );

      const { confirmed } = await app.verification.get(`reg:${phone}`);

      expect(confirmed).to.be.eq(true);
    });
  });
};
