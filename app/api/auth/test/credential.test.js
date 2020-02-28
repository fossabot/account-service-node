import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { request, result, getToken } from "../../../../test/utils";
import { password, user } from "./errors";

export default () => {
  describe("/credential", () => {
    const url = "/auth/credential";

    it("incomplete fields", async () => {
      result(
        await request("post", url, {
          auth: false,
          json: { id: "82988704537" }
        }),
        {
          "4xx": password.invalid
        }
      );
    });

    it("not found", async () => {
      result(
        await request("post", url, {
          auth: false,
          json: { id: "82999999999", pw: "123456" }
        }),
        {
          "4xx": user.notFound
        }
      );
    });

    it("wrong credentials", async () => {
      result(
        await request("post", url, {
          auth: false,
          json: { id: "82988704537", pw: "111111" }
        }),
        {
          "4xx": password.wrong
        }
      );
    });

    it("gen token", async () => {
      const token = await getToken();

      expect(token).to.be.a("string");

      const decoded = await decode(token);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });

    it("by email", async () => {
      const token = await getToken("ferco0@live.com");

      expect(token).to.be.a("string");

      const decoded = await decode(token);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });
  });
};
