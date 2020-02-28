import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent, request, result, getToken } from "../../../test/utils";
import app from "../../index";
import { invalidToken } from "./errors";

export default () => {
  const accountGetExpect = {
    access: 1,
    fn: "nando",
    ln: "costa",
    cpf: "76759553072",
    ncode: "55",
    phones: ["82988704537", "82988797979"],
    emails: ["ferco0@live.com"],
    birth: "1994-06-13T03:00:00.000Z",
    authSecondFactor: false,
    username: "ferco1"
  };

  describe("authorization", () => {
    it("deny by empty token", async () => {
      result(
        await request("get", "/account", { headers: { authorization: "" } }),
        { "4xx": invalidToken }
      );
    });

    it("deny by invalid token", async () => {
      const token = await getToken();

      result(
        await request("get", "/account", {
          headers: { authorization: `123${token}` }
        }),
        { "4xx": invalidToken }
      );
    });

    it("deny by invalid session", async () => {
      const authorization = await getToken();

      const { sid } = decode(authorization);

      await app.cache.del("session", sid);
      await app.models.sessions.set(sid, { active: false });

      global.token["82988704537"] = false;

      result(
        await request("get", "/account", {
          headers: { authorization }
        }),
        { "4xx": invalidToken }
      );
    });

    it("deny by invalid signature", async () => {
      const token = await getToken();
      // remove cache verification
      const { uid, sid } = decode(token);
      await app.cache.del("token", `${uid}.${sid}`);

      result(
        await request("get", "/account", {
          headers: { authorization: `${token}123` }
        }),
        { "4xx": invalidToken }
      );
    });

    it("get token from persistent storage", async () => {
      const authorization = await getToken();

      const { body } = result(
        await request("get", "/account", {
          headers: { authorization }
        }),
        { "2xx": { code: 200 } }
      );

      expect(body).to.be.deep.eq(accountGetExpect);
    });

    it("get token from cache", async () => {
      const token = await getToken();

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(200, accountGetExpect);
    });
  });
};
