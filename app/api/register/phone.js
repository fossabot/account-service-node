import { ncode, phone } from "./validations";

export default async function phoneController({ body }, app) {
  await app.validation(body, { ncode, phone });

  const { send, created } = await app.verification.create(
    `reg:${body.phone}`,
    `+${body.ncode}${body.phone}`
  );

  send && (await send("phone"));

  return {
    code: 201,
    content: { created }
  };
}
