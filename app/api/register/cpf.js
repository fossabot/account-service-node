import { code, cpf, birth } from "./validations";

export default async function cpfController(ctx, app) {
  await app.validation.validate(ctx.body, {
    code,
    cpf,
    birth
  });

  await app.verification.update(`reg:${ctx.body.phone}`, { cpf: ctx.body.cpf });

  return { code: 200 };
}
