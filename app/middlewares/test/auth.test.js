import { decode } from "jsonwebtoken";
import { agent, getToken, errors } from "../../../test/utils";
import app from "../../index";

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
      await agent()
        .get("/account")
        .set("authorization", "")
        .expect(400, { ...errors[400], message: "token must be provided" });
    });

    it("deny by invalid token", async () => {
      const token = await getToken();
      await agent()
        .get("/account")
        .set("authorization", `123${token}`)
        .expect(400, { ...errors[400], message: "invalid token" });
    });

    it("deny by invalid session", async () => {
      const token = await getToken();

      const { sid } = decode(token);

      await app.cache.del("session", sid);
      await app.models.sessions.del(sid);

      global.token = false;

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(406, { ...errors[406], message: "invalid session" });
    });

    it("deny by invalid signature", async () => {
      const token = await getToken();
      // remove cache verification
      const { uid, sid } = decode(token);
      await app.cache.del("token", `${uid}.${sid}`);

      await agent()
        .get("/account")
        .set("authorization", `${token}123`)
        .expect(400, { ...errors[400], message: "invalid token" });
    });

    it("get token from persistent storage", async () => {
      const token = await getToken();

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(200, accountGetExpect);
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
