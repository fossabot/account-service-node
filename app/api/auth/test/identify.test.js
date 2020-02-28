import { request, result } from "../../../../test/utils";
import { identification, user } from "./errors";

export default () => {
  describe("/identify", () => {
    it("error response if provide invalid identification", async () => {
      result(await request("get", "/auth/identify/_", { auth: false }), {
        "4xx": identification.invalid
      });
    });

    it("found the user", async () => {
      result(
        await request("get", "/auth/identify/82988704537", { auth: false }),
        {
          "2xx": { code: 200, body: { fn: "nando" } }
        }
      );
    });

    it("not found user", async () => {
      result(
        await request("get", "/auth/identify/82988444437", { auth: false }),
        {
          "4xx": user.notFound
        }
      );
    });
  });
};
