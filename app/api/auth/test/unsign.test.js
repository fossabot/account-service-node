import { expect } from "chai";
import { decode } from "jsonwebtoken";
import app from "../../../index";
import { request, getToken } from "../../../../test/utils";

export default () => {
  describe("/unsign", () => {
    it("simply work", async () => {
      const token = await getToken();

      const { uid, sid } = decode(token);

      expect((await request("post", "/auth/unsign")).status).to.be.eq(200);

      global.token["82988704537"] = false;

      const cacheToken = await app.cache.get("token", `${uid}.${sid}`);

      expect(cacheToken).to.be.eq(undefined);

      const session = await app.models.sessions.get(sid);

      expect(session.active).to.be.eq(false);
    });
  });
};
