import { agent, errors } from "../../../../test/utils";

export default () => {
  describe("/names", () => {
    it("error response if invalid username", async () => {
      await agent()
        .post("/register/names")
        .field("username", "..11564.")
        .expect(400, { ...errors[400], message: "invalid username" });

      await agent()
        .post("/register/names")
        .field("username", "a")
        .expect(400, { ...errors[400], message: "invalid username" });

      await agent()
        .post("/register/names")
        .field("username", "ab")
        .expect(400, { ...errors[400], message: "invalid username" });
    });

    it("not available username", async () => {
      await agent()
        .post("/register/names")
        .field("username", "ferco1")
        .field("fn", "fernando")
        .field("fn", "costa")
        .expect(200, { message: "in use" });
    });

    it("invalid name", async () => {
      await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "00")
        .expect(400, { ...errors[400], message: "invalid name" });

      await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "fo")
        .expect(400, { ...errors[400], message: "invalid name" });
    });

    it("invalid last name", async () => {
      await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "Vanilla")
        .field("ln", "0")
        .expect(400, { ...errors[400], message: "invalid last name" });

      await agent()
        .post("/register/names")
        .field("username", "username")
        .field("fn", "Vanilla")
        .field("ln", "fo")
        .expect(400, { ...errors[400], message: "invalid last name" });
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
