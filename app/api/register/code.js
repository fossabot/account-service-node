import { code } from "./validations";
import * as errors from "./errors";

const validations = { code };

export default async function codeController(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.i18n.language);

  if (!(await app.verification.check(`reg:${ctx.body.phone}`, ctx.body.code))) {
    throw app.validation.error(errors.code.wrong(ctx.i18n.language));
  }

  return {
    code: 200
  };
}
