import { username, fn, ln } from "./validations";

const validations = {
  username,
  fn,
  ln
};

export default async function names(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.i18n.language);

  return { code: 200 };
}
