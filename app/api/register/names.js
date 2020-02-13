import requestValidator from "./validator";

export default async function names(ctx, app) {
  await ctx.busboy.finish();
  const { response } = await requestValidator(ctx.body, {
    username: true,
    name: true
  });

  return (
    response || {
      content: { message: "ok" }
    }
  );
}
