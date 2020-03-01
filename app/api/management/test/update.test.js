import app from "../../../index";
import { expect } from "chai";
import { request, result, getToken } from "../../../../test/utils";
import { compare } from "bcrypt";
import * as errors from "./errors";

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
      result(
        await request("put", "/account/profile", {
          auth: true,
          json: { fn: "_fernando" }
        }),
        { "4xx": errors.names.invalid }
      );

      result(
        await request("put", "/account/profile", {
          auth: true,
          json: { ln: "fernando0" }
        }),
        {
          "4xx": errors.names.invalid
        }
      );
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
      ).to.be.eq(200);

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
      ).to.be.eq(200);

      expect(
        (
          await request("put", "/account/profile", {
            auth: true,
            json: { ln: "costa" }
          })
        ).status
      ).to.be.eq(200);
    });
  });

  /**
   * Password
   */
  describe("password", () => {
    it("should response with error if wrong password", async () => {
      result(
        await request("put", "/account/password", {
          auth: true,
          json: {
            current: "000000",
            want: "123456"
          }
        }),
        {
          "4xx": errors.password.wrong
        }
      );
    });
    it("should response with error if invalid passwords", async () => {
      result(
        await request("put", "/account/password", {
          auth: true,
          json: {
            current: "123456",
            want: ""
          }
        }),
        { "4xx": errors.password.invalid }
      );

      result(
        await request("put", "/account/password", {
          auth: true,
          json: {
            current: "",
            want: "123456"
          }
        }),
        { "4xx": errors.password.invalid }
      );

      result(
        await request("put", "/account/password", {
          auth: true,
          json: {
            current: "123",
            want: ""
          }
        }),
        { "4xx": errors.password.invalid }
      );

      result(
        await request("put", "/account/password", {
          auth: true,
          json: {
            current: "123456",
            want: "123"
          }
        }),
        { "4xx": errors.password.invalid }
      );
    });

    it("should update", async () => {
      const current = "123456";
      const want = "654321";
      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current,
              want
            }
          })
        ).status
      ).to.be.eq(200);

      const user = await app.models.users.getByPhone("82988704537");

      expect(await compare(want, user.pw)).to.be.eq(true);

      expect(
        (
          await request("put", "/account/password", {
            auth: true,
            json: {
              current: want,
              want: current
            }
          })
        ).status
      ).to.be.eq(200);
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

    async function setSecondFactor(authSecondFactor, expec) {
      result(
        await request("put", "/account/auth", {
          auth: true,
          json: {
            authSecondFactor
          }
        }),
        expec
      );
    }

    it("invalid field", async () => {
      await setSecondFactor("654321", { "4xx": errors.auth.invalid });
    });

    it("not own the contact", async () => {
      await setSecondFactor("+5582988447880", { "4xx": errors.auth.notOwn });
      await setSecondFactor("email@provider.com", {
        "4xx": errors.auth.notOwn
      });
    });

    it("define number", async () => {
      await setSecondFactor("+5582988704537", { "2xx": { code: 200 } });
      expect(await getSecondFactor()).to.be.eq("+5582988704537");
    });

    it("define email", async () => {
      await setSecondFactor("ferco0@live.com", { "2xx": { code: 200 } });
      expect(await getSecondFactor()).to.be.eq("ferco0@live.com");
    });

    it("disable", async () => {
      await setSecondFactor("false", { "2xx": { code: 200 } });
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
          result(
            await request("put", "/account/contact", {
              auth: true,
              json: {
                add: "82988873646"
              }
            }),
            { "4xx": errors.contact.item.add.inUse }
          );
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
            ).status
          ).to.be.eq(200);
        });

        it(`should response addition code wrong`, async () => {
          result(
            await request("put", "/account/contact", {
              auth: true,
              json: {
                add,
                code: ""
              }
            }),
            { "4xx": errors.contact.code.invalid }
          );

          result(
            await request("put", "/account/contact", {
              auth: true,
              json: {
                add,
                code: "12345"
              }
            }),
            { "4xx": errors.contact.code.wrong }
          );
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
            ).status
          ).to.be.eq(200);

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
          ).status
        ).to.be.eq(200);

        const { [field]: contacts } = await app.models.users.getByEmail(
          "ferco0@live.com"
        );

        expect(contacts).to.not.have.members([remove]);
      });
    }

    it("undefined action", async () => {
      result(
        await request("put", "/account/contact", {
          auth: true,
          json: {
            add: ""
          }
        }),
        {
          "4xx": errors.contact.undefined
        }
      );

      result(
        await request("put", "/account/contact", {
          auth: true,
          json: {
            remove: ""
          }
        }),
        {
          "4xx": errors.contact.undefined
        }
      );
    });

    describe("add", () => {
      it("invalid field", async () => {
        result(
          await request("put", "/account/contact", {
            auth: true,
            json: {
              add: "578798"
            }
          }),
          {
            "4xx": errors.contact.item.invalid
          }
        );
      });

      testContactAdd("phones");
      testContactAdd("emails");
    });

    describe("remove", () => {
      it("invalid field", async () => {
        result(
          await request("put", "/account/contact", {
            auth: true,
            json: {
              remove: "578798"
            }
          }),
          { "4xx": errors.contact.item.invalid }
        );
      });

      testContactRemove("phones");
      testContactRemove("emails");

      it("block remove auth second factor", async () => {
        const auth = await getToken("82988873646");

        result(
          await request("put", "/account/contact", {
            auth,
            json: { remove: "82988873646" }
          }),
          { "4xx": errors.contact.item.remove.secondFactor }
        );
      });

      it("block remove unique", async () => {
        const auth = await getToken("82988873647");

        result(
          await request("put", "/account/contact", {
            auth,
            json: { remove: "82988873647" }
          }),
          { "4xx": errors.contact.item.remove.single }
        );
      });
    });
  });
};
