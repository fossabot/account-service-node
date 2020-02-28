import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { request, result } from "../../../../test/utils";
import app from "../../../index";
import { code } from "./errors";

export default () => {
  describe("/code", () => {
    const credentialEndpoint = "/auth/credential";
    const codeEndpoint = "/auth/code";

    it("invalid code", async () => {
      result(
        await request("post", codeEndpoint, { json: { id: "82999999999" } }),
        {
          "4xx": code.invalid
        }
      );
      result(
        await request("post", codeEndpoint, {
          json: { id: "82999999999", code: "00" }
        }),
        { "4xx": code.invalid }
      );
    });

    it("inexistent code", async () => {
      result(
        await request("post", codeEndpoint, {
          json: { id: "82999999999", code: "12345" }
        }),
        { "4xx": code.wrong }
      );
    });

    it("wrong code", async () => {
      result(
        await request("post", credentialEndpoint, {
          json: { id: "82988873646", pw: "123456" }
        }),
        { "2xx": { code: 200, body: { content: { type: "string" } } } }
      );

      result(
        await request("post", codeEndpoint, {
          json: { id: "82988873646", code: "12345" }
        }),
        { "4xx": code.wrong }
      );
    });

    it("right code", async () => {
      const { code } = await app.verification.get("82988873646");

      expect(code).to.be.a("string");

      const { body } = result(
        await request("post", codeEndpoint, {
          json: { id: "82988873646", code }
        }),
        { "2xx": { code: 201 } }
      );
      const decoded = await decode(body.content);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });

    it("generate code by email", async () => {
      result(
        await request("post", credentialEndpoint, {
          json: { id: "ferc@live.com", pw: "123456" }
        }),
        { "2xx": { code: 200, body: { content: "fer*@live.com" } } }
      );
    });
  });
};
