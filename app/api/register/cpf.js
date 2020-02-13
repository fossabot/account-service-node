import requestValidator from "./validator";

const availableResponse = { content: { message: "ok" } };

export default async function cpfController(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    birth: true
  });

  const user = await app.models.users.getByCPF(ctx.body.cpf);

  if (user.data) {
    return {
      content: {
        message: "in use"
      }
    };
  }

  const { nbr, cpf } = ctx.body;

  const code = await app.cache.get("verificationCode", nbr);

  await app.cache.set("verificationCode", nbr, {
    ...code,
    cpf
  });

  return availableResponse;
}
