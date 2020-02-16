import profile from "./profile";
import password from "./password";
import authMode from "./auth-mode";

export default async function accountUpdateWrapper(ctx, app) {
  await ctx.busboy.finish();

  switch (ctx.body.action) {
    case "profile":
      return profile(ctx, app);
    case "password":
      return password(ctx, app);
    case "authMode":
      return authMode(ctx, app);
    default:
      throw app.createError(400);
  }
}
