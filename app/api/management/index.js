import auth from "../../middlewares/auth";
import update from "./update";
import picture from "./picture";

export default function management({ use, get, put }) {
  use(auth);
  use(async function catchUserData(ctx, app) {
    const user = await app.models.users.getById(ctx.user_id);

    user.id = ctx.user_id;
    ctx.attach("user", user);
  });

  get("/", async ctx => {
    const { fn, cpf, nbr, birth, ncode } = ctx.user;

    return { content: { fn, cpf, nbr, ncode, birth: birth.toDate() } };
  });

  put("/", update);

  put("/photo", picture);
  // get("/history/:page", history)
}
