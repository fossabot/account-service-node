import requestValidator from "./validator";

export default async function cpfController(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true
  });

  const { cpf } = ctx.body;
  const user = await app.data.users.get(cpf);

  if (user) {
    return {
      content: {
        status: "in-use"
      }
    };
    /*
      return {
        content: {
          fn: user.fn,
          status:
            "cpf already registered, if you owner it and don't make the registry, you can request now an audience to prove the ownership"
        }
      };
      */
  }

  return { content: { status: "no-registry" } };
}
