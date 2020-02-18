import app from "../../../index";
import { expect } from "chai";
import { agent, getToken } from "../../../../test/utils";
import { compare } from "bcrypt";

export default () => {
  const initialAccountExpect = {
    access: 1,
    fn: "nando",
    ln: "costa",
    cpf: "76759553072",
    ncode: "55",
    phones: ["82988704537", "82988797979"],
    birth: "1994-06-13T03:00:00.000Z",
    authSecondFactor: false,
    username: "ferco1"
  };

  describe("profile", () => {
    it("should response with error if invalid data", async () => {
      const token = await getToken();

      await agent()
        .put("/account/profile")
        .set("authorization", token)
        .field("fn", "_fernando")
        .expect(400);

      await agent()
        .put("/account/profile")
        .set("authorization", token)
        .field("ln", "fernando0")
        .expect(400);
    });

    it("should update", async () => {
      const token = await getToken();

      await agent()
        .put("/account/profile")
        .set("authorization", token)
        .field("fn", "fernando")
        .field("ln", "antonio")
        .expect(200, { message: "ok" });

      await agent()
        .get("/account")
        .set("authorization", token)
        .expect(200, {
          ...initialAccountExpect,
          fn: "fernando",
          ln: "antonio"
        });

      await agent()
        .put("/account/profile")
        .set("authorization", token)
        .field("fn", "nando")
        .expect(200, { message: "ok" });

      await agent()
        .put("/account/profile")
        .set("authorization", token)
        .field("ln", "costa")
        .expect(200, { message: "ok" });
    });
  });

  describe("password", () => {
    it("should response with error if wrong password", async () => {
      const token = await getToken();

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "000000")
        .field("want", "123456")
        .expect(406);
    });
    it("should response with error if invalid data", async () => {
      const token = await getToken();

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "123456")
        .field("want", "")
        .expect(400);

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "")
        .field("want", "123456")
        .expect(400);

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "123")
        .field("want", "")
        .expect(400);

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "123465")
        .field("want", "123")
        .expect(400);
    });

    it("should update", async () => {
      const token = await getToken();

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "123456")
        .field("want", "654321")
        .expect(200, { message: "ok" });

      const user = await app.models.users.getByPhone("82988704537");

      expect(await compare("654321", user.data.pw)).to.be.eq(true);

      await agent()
        .put("/account/password")
        .set("authorization", token)
        .field("current", "654321")
        .field("want", "123456")
        .expect(200, { message: "ok" });
    });
  });
};
