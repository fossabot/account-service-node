import requestValidator from "./validator";

export default async function phone(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true });
  // const { idBy } = await requestValidator(ctx.body, { phone: true /* id: true */ });

  const { nbr, ncode, renew } = ctx.body;
  // const { email, nbr, ncode,renew } = ctx.body;
  // const id = email || nbr;

  const user = await app.models.users.getByPhone(nbr);
  // const user = await app.models.users.get(id);
  if (user) {
    return { content: { message: "in use" } };
  }

  const { send, created } = await app.verification.create(
    `+${ncode}${nbr}`,
    renew
  );

  send && (await send("phone"));

  // const { created } = await app.verification.create(id, renew);

  return {
    code: 201,
    content: { message: "ok", created }
  };
}
