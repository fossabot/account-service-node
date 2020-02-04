import { agent, errors } from "../../../../test/utils";

export default () => {
  describe("/identify", () => {
    it("error response if incomplete fields", async () => {
      await agent()
        .post("/auth/identify")
        .field("id", "")
        .expect(400, { ...errors[400], message: "incomplete fields" });
    });

    it("success response if found the user", async () => {
      await agent()
        .post("/auth/identify")
        .field("id", "5582988704537")
        .expect(200, {
          fn: "nando"
        });
    });

    it("error response if not found user", async () => {
      await agent()
        .post("/auth/identify")
        .field("id", "5582988444437")
        .expect(422, { ...errors[422], message: "user not found" });
    });
  });
};
