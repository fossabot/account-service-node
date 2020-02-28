import app from "../../../index";
import { expect } from "chai";
import { request, getToken } from "../../../../test/utils";
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
        (
          await request("put", "/account/profile", {
            auth: true,
            json: { fn: "_fernando" }
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/profile", {
            auth: true,
            json: { ln: "fernando0" }
          })
        ).status
      ).to.be.eq(400);
    });

    it("should update", async () => {
      expect(
        (
          await request("put", "/account/profile", {
            auth: true,
            json: {
              fn: "fernando",
              ln: "antonio"
            }
          })
        ).status
      ).to.be.eq(201);

      expect(
        (await request("get", "/account", { auth: true })).body
      ).to.deep.eq({
        ...initialAccountExpect,
        fn: "fernando",
        ln: "antonio"
      });

      expect(
        (
          await request("put", "/account/profile", {
            auth: true,
            json: { fn: "nando" }
          })
        ).status
      ).to.be.eq(201);

      expect(
        (
          await request("put", "/account/profile", {
            auth: true,
            json: { ln: "costa" }
          })
        ).status
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
            auth: true,
            json: {
              current: "000000",
              want: "123456"
            }
          })
        ).status
      ).to.be.eq(406);
    });
    it("should response with error if invalid data", async () => {
      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "123456",
              want: ""
            }
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "",
              want: "123456"
            }
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "123",
              want: ""
            }
          })
        ).status
      ).to.be.eq(400);

      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "123456",
              want: "123"
            }
          })
        ).status
      ).to.be.eq(400);
    });

    it("should update", async () => {
      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "123456",
              want: "654321"
            }
          })
        ).status
      ).to.be.eq(201);

      const user = await app.models.users.getByPhone("82988704537");

      expect(await compare("654321", user.pw)).to.be.eq(true);

      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: "654321",
              want: "123456"
            }
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
      return (await app.models.users.getByPhone("82988704537"))
        .authSecondFactor;
    }

    async function setSecondFactor(authSecondFactor) {
      return (
        await request("put", "/account/auth", {
          auth: true,
          json: {
            authSecondFactor
          }
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

  /**
   * Update contacts
   */
  describe("contact", () => {
    const data = {
      phones: "82988877887",
      emails: "email@provider.com"
    };
    const testTitle = { phones: "number", emails: "email" };

    function testContactAdd(field) {
      const add = data[field];
      describe(testTitle[field], () => {
        it(`contact already in use`, async () => {
          expect(
            (
              await request("put", "/account/contact", {
                auth: true,
                json: {
                  add: "82988873646"
                }
              })
            ).body.message
          ).to.be.eq("in use");
        });

        it(`should request addition`, async () => {
          expect(
            (
              await request("put", "/account/contact", {
                auth: true,
                json: {
                  add
                }
              })
            ).body.message
          ).to.be.eq("ok");
        });

        it(`should response addition code wrong`, async () => {
          expect(
            (
              await request("put", "/account/contact", {
                auth: true,
                json: {
                  add,
                  code: ""
                }
              })
            ).body.message
          ).to.be.eq("invalid code");

          expect(
            (
              await request("put", "/account/contact", {
                auth: true,
                json: {
                  add,
                  code: "12345"
                }
              })
            ).body.message
          ).to.be.eq("invalid code");
        });

        it(`should add`, async () => {
          const { id } = await app.models.users.getByEmail("ferco0@live.com");
          const { code } = await app.verification.get(`${id}${add}`);

          expect(
            (
              await request("put", "/account/contact", {
                auth: true,
                json: {
                  add,
                  code
                }
              })
            ).body.message
          ).to.be.eq("ok");

          const { [field]: contacts } = await app.models.users.getByEmail(
            "ferco0@live.com"
          );

          expect(contacts).to.include.members([add]);
        });
      });
    }

    function testContactRemove(field) {
      const remove = data[field];
      it(`should remove ${testTitle[field]}`, async () => {
        expect(
          (
            await request("put", "/account/contact", {
              auth: true,
              json: {
                remove
              }
            })
          ).body.message
        ).to.be.eq("ok");

        const { [field]: contacts } = await app.models.users.getByEmail(
          "ferco0@live.com"
        );

        expect(contacts).to.not.have.members([remove]);
      });
    }

    it("undefined action", async () => {
      expect(
        (
          await request("put", "/account/contact", {
            auth: true,
            json: {
              add: ""
            }
          })
        ).body.message
      ).to.be.eq("undefined action");

      expect(
        (
          await request("put", "/account/contact", {
            auth: true,
            json: {
              remove: ""
            }
          })
        ).body.message
      ).to.be.eq("undefined action");
    });

    describe("add", () => {
      it("invalid field", async () => {
        expect(
          (
            await request("put", "/account/contact", {
              auth: true,
              json: {
                add: "578798"
              }
            })
          ).body.message
        ).to.be.eq("invalid fields");
      });

      testContactAdd("phones");
      testContactAdd("emails");
    });

    describe("remove", () => {
      it("invalid field", async () => {
        expect(
          (
            await request("put", "/account/contact", {
              auth: true,
              json: {
                remove: "578798"
              }
            })
          ).body.message
        ).to.be.eq("invalid fields");
      });

      testContactRemove("phones");
      testContactRemove("emails");

      it("block remove auth second factor", async () => {
        const auth = await getToken("82988873646");

        expect(
          (
            await request("put", "/account/contact", {
              auth,
              json: { remove: "82988873646" }
            })
          ).body.message
        ).to.be.eq("not allowed");
      });

      it("block remove unique", async () => {
        const auth = await getToken("82988873647");

        expect(
          (
            await request("put", "/account/contact", {
              auth,
              json: { remove: "82988873647" }
            })
          ).body.message
        ).to.be.eq("can't remove the only contact method");
      });
    });
  });
};
