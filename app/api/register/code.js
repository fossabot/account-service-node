import { code } from "./validations";
import * as errors from "./errors";

const validations = { code };

export default async function codeController(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.language);

  if (!(await app.verification.check(`reg:${ctx.body.phone}`, ctx.body.code))) {
    throw app.validation.error(errors.code.wrong(ctx.language));
  }

  return true;
}
