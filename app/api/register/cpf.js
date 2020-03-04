import { code, cpf, birth } from "./validations";

const validations = {
  code,
  cpf,
  birth
};

export default async function cpfController(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.i18n.language);

  await app.verification.update(`reg:${ctx.body.phone}`, { cpf: ctx.body.cpf });

  return { code: 200 };
}
