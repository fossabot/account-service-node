import requestValidator from "./validator";

export default async function record(ctx, app) {
  await ctx.busboy.finish();
  const codeData = await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    pw: true
  });

  const { name, nbr, cpf, birth, pw } = ctx.body;

  if (codeData.cpf !== cpf) {
    throw app.createError(400, "invalid cpf", {
      dangerous: "Registry record, changed data"
    });
  }

  if (!(await trustCPF(cpf, birth))) {
    throw app.createError(400, "invalid cpf", { dangerous: "Auto generated" });
  }

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
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
