import { ncode, phone } from "./validations";

export default async function phoneController(ctx, app) {
  await app.validation.validate(ctx.body, { ncode, phone });

  const { send, created } = await app.verification.create(
    `reg:${ctx.body.phone}`,
    `+${ctx.body.ncode}${ctx.body.phone}`
  );

  send && (await send("phone"));

  return {
    code: 201,
    content: { created }
  };
}
