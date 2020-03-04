import { password } from "./validations";
import { password as pwError } from "./errors";
import { compare, hash } from "bcrypt";

const validations = {
  current: password,
  want: password
};

export default async function updatePassword(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.language);

  if (!(await compare(ctx.body.current, ctx.user.data.pw))) {
    throw app.validation.error(pwError.wrong(ctx.language));
  }

  await ctx.user.update({ pw: await hash(ctx.body.want, 10) });

  return true;
}
