import { code, cpf, birth } from "./validations";
import * as errors from "./errors";

const validations = {
  code,
  cpf,
  birth
};

export default async function cpfController(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.language);

  if (!(await app.verification.check(`reg:${ctx.body.phone}`, ctx.body.code))) {
    throw app.validation.error(errors.code.wrong(ctx.language));
  }

  await app.verification.update(`reg:${ctx.body.phone}`, { cpf: ctx.body.cpf });

  return { code: 200 };
}
