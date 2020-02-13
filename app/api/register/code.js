import requestValidator from "./validator";

export default async function code(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true, code: true });

  const { nbr, code: sentCode } = ctx.body;

  const codeData = await app.cache.get("verificationCode", nbr);

  if (codeData.code === sentCode) {
    await app.cache.set("verificationCode", nbr, {
      ...codeData,
      confirmed: true
    });

    return {
      content: { message: "ok" }
    };
  }

  throw app.createError(400, "invalid code");
}
