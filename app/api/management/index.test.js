// import { expect } from "chai";
import { agent, getToken } from "../../../test/utils";

describe("account management", () => {
  it("get data", async () => {
    const token = await getToken();

    await agent()
      .get("/account")
      .set("authorization", token)
      .expect(200, {
        fn: "nando",
        cpf: "76759553072",
        ncode: "55",
        nbr: "82988704537",
        birth: "1994-06-13T03:00:00.000Z"
      });
  });
});
