// middlewares
import createAuthMiddleware from "../../middlewares/auth";

export default function unsign({ use, post }) {
  use(createAuthMiddleware());

  post("/", async (ctx, app) => {
    await app.sessions.remove(ctx.userId, ctx.session.id);

    return { content: { message: "ok" } };
  });
}
