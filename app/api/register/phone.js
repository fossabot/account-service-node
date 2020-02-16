import requestValidator from "./validator";

export default async function phone(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true });

  const { nbr, ncode } = ctx.body;

  if (await app.cache.get("verificationCode", nbr)) {
    return { content: { message: "already requested" } };
  }

  const user = await app.models.users.getByPhone(nbr);
  if (user.data) {
    return { content: { message: "in use" } };
  }

  const { code, message, created } = app.utils.makeVerifyCode();

  if (process.env.NODE_ENV === "production") {
    await app.sms.send(`+${ncode}${nbr}`, message);
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log("Code:", code);
    }
  }

  await app.cache.set(
    "verificationCode",
    nbr,
    { code, created, confirmed: false, cpf: "" },
    60 * 5
  );

  return {
    content: { message: "ok", created }
  };
}
