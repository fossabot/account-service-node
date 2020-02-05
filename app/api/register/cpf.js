import requestValidator from "./validator";

const availableResponse = { content: { message: "available" } };

export default async function cpfController(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true
  });

  const user = await app.models.users.getByCPF(ctx.body.cpf);

  if (user) {
    return {
      content: {
        message: "in use"
      }
    };
  }

  return availableResponse;
}
