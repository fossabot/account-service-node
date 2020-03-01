import { ncode, phone } from "./validations";

export default async function phoneController(ctx, app) {
  await app.validation.validate(ctx.body, { ncode, phone });

  const { created } = await app.verification.create(
    `reg:${ctx.body.phone}`,
    `+${ctx.body.ncode}${ctx.body.phone}`
  );

  return {
    code: 201,
    body: { created }
  };
}
