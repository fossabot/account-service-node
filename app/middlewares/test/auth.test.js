import { decode } from "jsonwebtoken";
import { agent, getToken, errors } from "../../../test/utils";
import app from "../../index";

export default () => {
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

      await app.cache.del("sessions", sid);
      await app.models.sessions.del(sid);

      global.token = false;

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(406, { ...errors[406], message: "session not found" });
    });

    it("deny by invalid signature", async () => {
      const token = await getToken();
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
        .expect(200, {
          fn: "nando",
          cpf: "76759553072",
          nbr: "5582988704537",
          birth: "1994-06-13T03:00:00.000Z"
        });
    });

    it("get token from cache", async () => {
      const token = await getToken();

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(200, {
          fn: "nando",
          cpf: "76759553072",
          nbr: "5582988704537",
          birth: "1994-06-13T03:00:00.000Z"
        });
    });
  });
};
