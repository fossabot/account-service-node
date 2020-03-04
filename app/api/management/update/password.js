import { password } from "./validations";
import { password as pwError } from "./errors";
import { compare, hash } from "bcrypt";

export default async function updatePassword(ctx, app) {
  await app.validation.validate(ctx.body, {
    current: password,
    want: password
  });

  if (!(await compare(ctx.body.current, ctx.user.data.pw))) {
    throw app.validation.error(pwError.wrong);
  }

  await ctx.user.update({ pw: await hash(ctx.body.want, 10) });

  return true;
}
