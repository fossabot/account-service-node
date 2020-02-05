import requestValidator from "./validator";

export default async function phone(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true });

  const { nbr } = ctx.body;

  if (await app.cache.get("verificationCode", nbr)) {
    return { content: { message: "already requested" } };
  }

  if (await app.models.users.getByPhone(nbr)) {
    return { content: { message: "in use" } };
  }

  const { code, message, created } = app.utils.makeVerifyCode();

  if (process.env.NODE_ENV !== "test") {
    await app.sms.send(`+${nbr}`, message);
  }

  await app.cache.set(
    "verificationCode",
    nbr,
    { code, created, confirmed: false, cpf: "" },
    60 * 5
  );

  return {
    content: { message: "created", created }
  };
}
