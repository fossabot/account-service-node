import requestValidator from "./validator";

export default async function code(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true, code: true });

  const { nbr, code: sentCode } = ctx.body;

  if (!sentCode) throw app.createError(400, "invalid code", { nbr, sentCode });

  const codeData = await app.cache.get("verificationCode", nbr);

  if (!codeData) {
    return {
      content: {
        message: "code not found"
      }
    };
  }

  if (sentCode !== codeData.code) {
    return {
      content: {
        message: "wrong code"
      }
    };
  }

  await app.cache.set("verificationCode", nbr, {
    ...codeData,
    confirmed: true
  });

  return {
    content: { message: "ok" }
  };
}
