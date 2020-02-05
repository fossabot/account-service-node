import requestValidator from "./validator";

export default async function record(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    pw: true
  });

  const { name, nbr, cpf, birth, pw } = ctx.body;
  const [user] = await app.models.users.query({
    where: [
      ["nbr", "==", nbr],
      ["cpf", "==", cpf]
    ]
  });

  if (user) {
    console.error(
      `Registry record, user existence, condition hit, Context:`,
      ctx
    );
    return {
      content: {
        message: "in use"
      }
    };
  }

  if (!(await trustCPF(cpf, birth))) throw app.createError(400, "invalid cpf");

  const newUser = await app.models.users.create({
    nbr,
    name,
    cpf,
    birth,
    pw
  });

  return {
    content: { id: newUser.id }
  };
}

async function trustCPF(cpf, birth) {
  // regex(cpf) &&
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
