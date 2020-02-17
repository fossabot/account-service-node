import { agent, getToken } from "../../../../test/utils";

export default () => {
  let token;
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

  it("get data", async () => {
    token = token || (await getToken());

    await agent()
      .get("/account")
      .set("authorization", token)
      .expect(200, initialAccountExpect);
  });
};
