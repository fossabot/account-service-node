import { expect } from "chai";
import { decode } from "jsonwebtoken";
import { agent, getToken, errors } from "../../../../test/utils";

export default () => {
  describe("/sign", () => {
    it("incomplete fields", async () => {
      await agent()
        .post("/auth/sign")
        .field("id", "5582999999999")
        .expect(400, { ...errors[400], message: "incomplete fields" });
    });
    it("not found", async () => {
      await agent()
        .post("/auth/sign")
        .field("id", "5582999999999")
        .field("pw", "123")
        .expect(422, { ...errors[422], message: "user not found" });
    });

    it("wrong credentials", async () => {
      await agent()
        .post("/auth/sign")
        .field("id", "5582988704537")
        .field("pw", "1234")
        .expect(401, { ...errors[401], message: "wrong credentials" });
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
