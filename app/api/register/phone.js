import { ncode, phone } from "./validations";

const validations = { ncode, phone };

export default async function phoneController(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.language);

  const { created } = await app.verification.create(
    `reg:${ctx.body.phone}`,
    `+${ctx.body.ncode}${ctx.body.phone}`
  );

  return {
    code: 201,
    body: { created }
  };
}
