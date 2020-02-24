import app from "../../../index";
import { expect } from "chai";
import { request } from "../../../../test/utils";
import { compare } from "bcrypt";

export default () => {
  const initialAccountExpect = {
    access: 1,
    fn: "nando",
    ln: "costa",
    cpf: "76759553072",
    ncode: "55",
    phones: ["82988704537", "82988797979"],
    emails: ["ferco0@live.com"],
    birth: "1994-06-13T03:00:00.000Z",
    authSecondFactor: false,
    username: "ferco1"
  };

  /**
   * Profile
   */
  describe("profile", () => {
    it("should response with error if invalid data", async () => {
      expect(
        (await request("put", "/account/profile", { fn: "_fernando" })).status
      ).to.be.eq(400);

      expect(
        (await request("put", "/account/profile", { ln: "fernando0" })).status
      ).to.be.eq(400);
    });

    it("should update", async () => {
      expect(
        (
          await request("put", "/account/profile", {
            fn: "fernando",
            ln: "antonio"
          })
        ).status
      ).to.be.eq(201);

      expect((await request("get", "/account")).body).to.deep.eq({
        ...initialAccountExpect,
        fn: "fernando",
        ln: "antonio"
      });

      expect(
        (await request("put", "/account/profile", { fn: "nando", ln: "costa" }))
          .status
      ).to.be.eq(201);
    });
  });

  /**
   * Password
   */
  describe("password", () => {
    it("should response with error if wrong password", async () => {
      expect(
        (
          await request("put", "/account/password", {
            current: "000000",
            want: "123456"
          })
        ).status
      ).to.be.eq(406);
    });
    it("should response with error if invalid data", async () => {
      expect(
        (
          await request("put", "/account/password", {
            current: "123456",
            want: ""
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            current: "",
            want: "123456"
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            current: "123",
            want: ""
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            current: "123456",
            want: "123"
          })
        ).status
      ).to.be.eq(400);
    });

    it("should update", async () => {
      expect(
        (
          await request("put", "/account/password", {
            current: "123456",
            want: "654321"
          })
        ).status
      ).to.be.eq(201);

      const user = await app.models.users.getByPhone("82988704537");

      expect(await compare("654321", user.data.pw)).to.be.eq(true);

      expect(
        (
          await request("put", "/account/password", {
            current: "654321",
            want: "123456"
          })
        ).status
      ).to.be.eq(201);
    });
  });

  /**
   * Authentication method
   */
  describe("authentication with two factors", () => {
    async function getSecondFactor() {
      return (await app.models.users.getByPhone("82988704537")).data
        .authSecondFactor;
    }

    async function setSecondFactor(authSecondFactor) {
      return (
        await request("put", "/account/auth", {
          authSecondFactor
        })
      ).status;
    }

    it("invalid field", async () => {
      expect(await setSecondFactor("654321")).to.be.eq(400);
    });

    it("not own the contact", async () => {
      expect(await setSecondFactor("+5582988447880")).to.be.eq(406);
      expect(await setSecondFactor("email@provider.com")).to.be.eq(406);
    });

    it("define number", async () => {
      expect(await setSecondFactor("+5582988704537")).to.be.eq(201);
      expect(await getSecondFactor()).to.be.eq("+5582988704537");
    });

    it("define email", async () => {
      expect(await setSecondFactor("ferco0@live.com")).to.be.eq(201);
      expect(await getSecondFactor()).to.be.eq("ferco0@live.com");
    });

    it("disable", async () => {
      expect(await setSecondFactor("false")).to.be.eq(201);
      expect(await getSecondFactor()).to.be.eq(false);
    });
  });
};
