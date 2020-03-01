import { name } from "./validations";

export default async function updateProfile(ctx, app) {
  await app.validation.validate(ctx.body, {
    fn: name,
    ln: name
  });

  const data = {};

  if (ctx.body.fn) {
    data.fn = ctx.body.fn;
  }

  if (ctx.body.ln) {
    data.ln = ctx.body.ln;
  }

  await ctx.user.update(data);

  return true;
}
