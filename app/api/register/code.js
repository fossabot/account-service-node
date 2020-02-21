import requestValidator from "./validator";

export default async function code(ctx, app) {
  await ctx.busboy.finish();
  await requestValidator(ctx.body, { phone: true, code: true });

  const { nbr, ncode, code } = ctx.body;

  if (!(await app.verification.confirm(`+${ncode}${nbr}`, code)))
    throw app.createError(406);

  return {
    content: { message: "ok" }
  };
}
