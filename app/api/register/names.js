import { username, fn, ln } from "./validations";

export default async function names(ctx, app) {
  await app.validation.validate(ctx.body, {
    username,
    fn,
    ln
  });

  return { code: 200 };
}
