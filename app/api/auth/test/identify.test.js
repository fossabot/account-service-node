import { agent, errors } from "../../../../test/utils";

export default () => {
  describe("/identify", () => {
    it("error response if incomplete fields", async () => {
      await agent()
        .post("/auth/identify")
        .field("_", "")
        .expect(400, { ...errors[400], message: "incomplete fields" });
    });

    it("found the user", async () => {
      await agent()
        .post("/auth/identify")
        .field("nbr", "82988704537")
        .expect(200, {
          user: { fn: "nando" }
        });
    });

    it("not found user", async () => {
      await agent()
        .post("/auth/identify")
        .field("nbr", "82988444437")
        .expect(200, { user: null });
    });
  });
};
