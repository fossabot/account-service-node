import createAuthMiddleware from "../../middlewares/auth";

import photo from "./update/photo";

import update from "./update";

export default function management({ use, get, put }) {
  use(createAuthMiddleware());
  use(async function catchUserData(ctx, app) {
    const user = await app.models.users.getById(ctx.user_id);

    const userObject = {
      data: user.data,
      async update(data) {
        await app.models.users.set(user.id, data);
        return Object.assign(userObject.data, data);
      }
    };

    ctx.attach("user", userObject);
  });

  get("/", async ctx => {
    const {
      username,
      access,
      fn,
      ln,
      cpf,
      phones,
      birth,
      ncode,
      photo,
      twoFactors
    } = ctx.user.data;

    return {
      content: {
        username,
        fn,
        ln,
        cpf,
        phones,
        ncode,
        photo,
        access,
        twoFactors,
        birth: birth.toDate()
      }
    };
  });

  put("/", update);
  put("/photo", photo);

  // get("/history/:page", history)
}
