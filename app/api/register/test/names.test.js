import { expect } from "chai";
import { agent } from "../../../../test/utils";

export default () => {
  describe("/names", () => {
    it("error response if invalid username", async () => {
      const { status: resCode1, body: body1 } = await agent()
        .post("/register/names")
        .field("username", "..11564.");

      expect(resCode1).to.be.eq(400);
      expect(body1.message).to.be.eq("invalid username");

      const { status: resCode2, body: body2 } = await agent()
        .post("/register/names")
        .field("username", "a");

      expect(resCode2).to.be.eq(400);
      expect(body2.message).to.be.eq("invalid username");

      const { status: resCode3, body: body3 } = await agent()
        .post("/register/names")
        .field("username", "ab");

      expect(resCode3).to.be.eq(400);
      expect(body3.message).to.be.eq("invalid username");
    });

    it("already registred username", async () => {
      await agent()
        .post("/register/names")
        .field("username", "ferco1")
        .field("fn", "fernando")
        .field("fn", "costa")
        .expect(200, { message: "in use" });
    });

    it("invalid name", async () => {
      const { status: resCode1, body: body1 } = await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "00");

      expect(resCode1).to.be.eq(400);
      expect(body1.message).to.be.eq("invalid name");

      const { status: resCode2, body: body2 } = await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "fo");

      expect(resCode2).to.be.eq(400);
      expect(body2.message).to.be.eq("invalid name");
    });

    it("invalid last name", async () => {
      const { status: resCode1, body: body1 } = await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "Vanilla")
        .field("ln", "0");

      expect(resCode1).to.be.eq(400);
      expect(body1.message).to.be.eq("invalid last name");

      const { status: resCode2, body: body2 } = await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "Vanilla")
        .field("ln", "fo");

      expect(resCode2).to.be.eq(400);
      expect(body2.message).to.be.eq("invalid last name");
    });

    it("valid names", async () => {
      await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "Vanilla")
        .field("ln", "Origin")
        .expect(200, { message: "ok" });
    });
  });
};
