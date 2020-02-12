import requestValidator from "./validator";

export default async function record(ctx, app) {
  await ctx.busboy.finish();
  const { codeData } = await requestValidator(ctx.body, {
    phone: true,
    code: "confirmed",
    cpf: true,
    birth: true,
    name: true,
    username: true,
    pw: true,
    terms: true
  });

  const { username, fn, ln, ncode, nbr, cpf, birth, pw, terms } = ctx.body;

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
    nbr,
    username,
    fn,
    ln,
    cpf,
    birth,
    pw,
    terms
  });

  const session = {
    user_id: user.id,
    created: new Date().toString(),
    ua: ctx.headers["user-agent"],
    ip: ctx.ip || ctx.ips[ctx.ips.length - 1]
  };

  const { id: sid } = await app.models.sessions.create(session);
  const tokenData = { uid: user.id, sid };

  const token = await app.jwt.sign(tokenData);

  await app.cache.set("sessions", sid, session, 3600 * 60);
  tokenData.iat = Math.round(Date.now() / 1000);
  await app.cache.set("token", token, tokenData, 3600 * 15);

  return {
    content: { id: user.id, token }
  };
}

async function trustCPF(cpf, birth) {
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
