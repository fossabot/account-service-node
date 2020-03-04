import * as validations from "./validations";
import * as errors from "./errors";

export default async function record(ctx, app) {
  await app.validation.validate(ctx.body, validations, ctx.i18n.language);

  if (!(await app.verification.check(`reg:${ctx.body.phone}`, ctx.body.code))) {
    throw app.validation.error(errors.code.wrong(ctx.i18n.language));
  }

  const { username, fn, ln, ncode, phone, cpf, birth, pw, terms } = ctx.body;

  const codeData = await app.verification.get(`reg:${phone}`);

  if (codeData.cpf !== cpf) {
    console.error(
      "Registry finish, changed data",
      "phone:",
      phone,
      codeData.cpf,
      " > ",
      cpf
    );
    throw app.validation.error(errors.cpf.invalid);
  }

  if (!(await trustCPF(cpf, birth))) {
    throw app.createError(400, "invalid cpf", {
      dangerous: "Probaly auto generated"
    });
  }

  const user = await app.models.users.create({
    ncode,
    phones: [phone],
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
    .del("verificationCode", `reg:${phone}`)
    .catch(e => console.error("Delete verification register code, err:", e));

  return {
    code: 201,
    body: { id: user.id, message: "ok" }
  };
}

async function trustCPF(cpf, birth) {
  // rf_api(cpf) &&
  // compare rf_response.data.birth === birth
  return true;
}
