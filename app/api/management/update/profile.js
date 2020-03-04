import { name } from "./validations";
import { names } from "./errors";

const validations = {
  fn: name(names.firstName.invalid),
  ln: name(names.lastName.invalid)
};

export default async function updateProfile(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.language);

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
