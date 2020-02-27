import { agent } from "../../../../test/utils";
import { invalidId, userNotFound } from "./errors";

export default () => {
  describe("/identify", () => {
    it("error response if provide invalid identification", async () => {
      await agent()
        .get("/auth/identify/_")
        .expect(422, invalidId);
    });

    it("found the user", async () => {
      await agent()
        .get("/auth/identify/82988704537")
        .expect(200, {
          user: { fn: "nando" }
        });
    });

    it("not found user", async () => {
      await agent()
        .get("/auth/identify/82988444437")
        .expect(404, userNotFound);
    });
  });
};
