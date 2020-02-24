import requestValidator from "./validator";

export default async function record(ctx, app) {
  await ctx.busboy.finish();
  const { response } = await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    birth: true,
    name: true,
    username: true,
    pw: true,
    terms: true
  });

  if (response) return response;

  const { username, fn, ln, ncode, nbr, cpf, birth, pw, terms } = ctx.body;

  const codeData = await app.verification.get(`+${ncode}${nbr}`);

  if (codeData.cpf !== cpf) {
    throw app.createError(400, "invalid cpf", {
      dangerous: "Registry finish, changed data"
    });
  }

  if (!(await trustCPF(cpf, birth))) {
    throw app.createError(400, "invalid cpf", {
      dangerous: "Probaly auto generated"
    });
  }

  const user = await app.models.users.create({
    ncode,
    phones: [nbr],
    emails: [],
    username,
    fn,
    ln,
    cpf,
    birth,
    pw,
    terms,
    access: 1,
    authSecondFactor: false
  });

  app.cache
    .del("verificationCode", nbr)
    .catch(e => console.error("Delete verification register code, err:", e));

  return {
    code: 201,
    content: { id: user.id, message: "ok" }
  };
}

async function trustCPF(cpf, birth) {
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
