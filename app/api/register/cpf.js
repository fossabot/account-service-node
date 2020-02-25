import requestValidator from "./validator";

export default async function cpf(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    birth: true
  });

  const user = await app.models.users.getByCPF(ctx.body.cpf);

  if (user) {
    return {
      content: {
        message: "in use"
      }
    };
  }

  const { nbr, cpf, ncode } = ctx.body;

  await app.verification.update(`+${ncode}${nbr}`, { cpf });

  return { content: { message: "ok" } };
}
