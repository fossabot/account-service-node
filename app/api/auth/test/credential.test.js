import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent, getToken } from "../../../../test/utils";
import { invalidPassword, userNotFound, wrongPassword } from "./errors";

export default () => {
  describe("/credential", () => {
    it("incomplete fields", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82988704537")
        .expect(422, invalidPassword);
    });

    it("not found", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82999999999")
        .field("pw", "123456")
        .expect(404, userNotFound);
    });

    it("wrong credentials", async () => {
      await agent()
        .post("/auth/credential")
        .field("id", "82988704537")
        .field("pw", "111111")
        .expect(422, wrongPassword);
    });

    it("gen token", async () => {
      const token = await getToken();

      expect(token).to.be.a("string");

      const decoded = await decode(token);

      expect(decoded)
        .to.be.a("object")
        .that.have.all.keys(["sid", "uid", "iat"]);
    });
  });
};
